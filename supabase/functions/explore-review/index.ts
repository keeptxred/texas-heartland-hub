import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-import-secret",
};

type ReviewAction = "approve" | "reject" | "merge" | "rollback";

interface ReviewRequest {
  action: ReviewAction;
  recordId?: string;
  jobId?: string;
  targetEntityId?: string;
  reviewerId?: string;
  notes?: string;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function authorized(request: Request): boolean {
  const configured = Deno.env.get("EXPLORE_IMPORT_SECRET");
  if (!configured) return true;
  const direct = request.headers.get("x-import-secret");
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return direct === configured || bearer === configured;
}

function slugify(value: string): string {
  return (
    value
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 96) || "explore-entity"
  );
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
  if (!authorized(request)) return json({ error: "Unauthorized" }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey)
    return json({ error: "Supabase service configuration is missing" }, 500);
  const client = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

  let body: ReviewRequest;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON request body" }, 400);
  }

  if (!body.action) return json({ error: "action is required" }, 400);

  if (body.action === "rollback") {
    if (!body.jobId) return json({ error: "jobId is required for rollback" }, 400);
    const { data: revisions, error: revisionError } = await client
      .from("explore_import_revisions")
      .select("id,entity_id,before_snapshot,after_snapshot")
      .eq("job_id", body.jobId)
      .order("created_at", { ascending: false });
    if (revisionError) return json({ error: revisionError.message }, 500);

    let restored = 0;
    let removed = 0;
    for (const revision of revisions ?? []) {
      if (revision.before_snapshot) {
        const before = revision.before_snapshot as Record<string, unknown>;
        const { id: _ignored, ...values } = before;
        const { error } = await client
          .from("explore_entities")
          .update(values)
          .eq("id", revision.entity_id);
        if (error) return json({ error: error.message, revisionId: revision.id }, 500);
        restored += 1;
      } else {
        const { error } = await client
          .from("explore_entities")
          .delete()
          .eq("id", revision.entity_id);
        if (error) return json({ error: error.message, revisionId: revision.id }, 500);
        removed += 1;
      }
    }

    const completedAt = new Date().toISOString();
    await client
      .from("explore_import_jobs")
      .update({ status: "rolled_back", completed_at: completedAt })
      .eq("id", body.jobId);
    await client.from("explore_import_rollbacks").insert({
      job_id: body.jobId,
      restored_entities: restored,
      removed_entities: removed,
      performed_by: body.reviewerId ?? null,
      notes: body.notes ?? null,
      completed_at: completedAt,
    });
    return json({ jobId: body.jobId, status: "rolled_back", restored, removed });
  }

  if (!body.recordId) return json({ error: "recordId is required" }, 400);
  const { data: record, error: recordError } = await client
    .from("explore_import_records")
    .select("*,explore_import_sources(*)")
    .eq("id", body.recordId)
    .single();
  if (recordError || !record)
    return json({ error: recordError?.message ?? "Import record not found" }, 404);

  if (body.action === "reject") {
    const reviewedAt = new Date().toISOString();
    const { error } = await client
      .from("explore_import_records")
      .update({
        review_status: "rejected",
        reviewed_at: reviewedAt,
        reviewed_by: body.reviewerId ?? null,
        review_notes: body.notes ?? null,
      })
      .eq("id", body.recordId);
    if (error) return json({ error: error.message }, 500);
    return json({ recordId: body.recordId, reviewStatus: "rejected" });
  }

  const draft = record.normalized_payload as Record<string, unknown>;
  const entityTypeKey = String(draft.entityType ?? "place");
  const { data: entityType, error: typeError } = await client
    .from("explore_entity_types")
    .select("id")
    .eq("key", entityTypeKey)
    .maybeSingle();
  if (typeError) return json({ error: typeError.message }, 500);
  if (!entityType) return json({ error: `Unknown Explore entity type ${entityTypeKey}` }, 422);

  let entityId = body.targetEntityId ?? record.entity_id ?? null;
  let beforeSnapshot: Record<string, unknown> | null = null;
  if (entityId) {
    const { data: existing, error } = await client
      .from("explore_entities")
      .select("*")
      .eq("id", entityId)
      .single();
    if (error || !existing)
      return json({ error: error?.message ?? "Target entity not found" }, 404);
    beforeSnapshot = existing;
  }

  const baseSlug = slugify(String(draft.slug ?? draft.name ?? "explore-entity"));
  let slug = baseSlug;
  for (let suffix = 2; suffix < 1000; suffix += 1) {
    const { data: match } = await client
      .from("explore_entities")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!match || match.id === entityId) break;
    slug = `${baseSlug}-${suffix}`;
  }

  const entityValues = {
    entity_type_id: entityType.id,
    name: String(draft.name),
    slug,
    short_description: draft.description ? String(draft.description).slice(0, 500) : null,
    long_description: draft.description ? String(draft.description) : null,
    status: "reviewed",
    visibility: "internal",
    source_confidence: 90,
  };

  if (entityId) {
    const nextVersion = Number(beforeSnapshot?.version ?? 1) + 1;
    const { data: updated, error } = await client
      .from("explore_entities")
      .update({ ...entityValues, version: nextVersion })
      .eq("id", entityId)
      .select("*")
      .single();
    if (error || !updated) return json({ error: error?.message ?? "Entity update failed" }, 500);
    await client.from("explore_entity_versions").insert({
      entity_id: entityId,
      version: nextVersion,
      snapshot: updated,
      change_summary: `Updated from ${record.external_id}`,
      change_source: "import",
      changed_by_user_id: body.reviewerId ?? null,
    });
  } else {
    const { data: inserted, error } = await client
      .from("explore_entities")
      .insert(entityValues)
      .select("*")
      .single();
    if (error || !inserted) return json({ error: error?.message ?? "Entity creation failed" }, 500);
    entityId = inserted.id;
    await client.from("explore_entity_versions").insert({
      entity_id: entityId,
      version: 1,
      snapshot: inserted,
      change_summary: `Created from ${record.external_id}`,
      change_source: "import",
      changed_by_user_id: body.reviewerId ?? null,
    });
  }

  const source = record.explore_import_sources as Record<string, unknown> | null;
  if (source) {
    const { data: provenanceSource } = await client
      .from("explore_sources")
      .upsert(
        {
          name: String(source.name ?? source.source_type ?? "Imported source"),
          source_type: "government",
          base_url: source.endpoint ? new URL(String(source.endpoint)).origin : null,
          publisher: String(source.name ?? source.source_type ?? "Imported source"),
          default_confidence: 90,
          is_authoritative: true,
          is_active: true,
        },
        { onConflict: "name,publisher" },
      )
      .select("id")
      .single();
    if (provenanceSource) {
      await client.from("explore_entity_sources").upsert(
        {
          entity_id: entityId,
          source_id: provenanceSource.id,
          source_url: draft.sourceUrl ?? source.endpoint ?? null,
          external_id: record.external_id,
          confidence: 90,
          retrieved_at: record.created_at,
          raw_metadata: draft.metadata ?? {},
        },
        { onConflict: "entity_id,source_id,external_id,source_url" },
      );
    }
  }

  const reviewStatus = body.action === "merge" ? "merged" : "approved";
  const reviewedAt = new Date().toISOString();
  await client
    .from("explore_import_records")
    .update({
      entity_id: entityId,
      review_status: reviewStatus,
      reviewed_at: reviewedAt,
      reviewed_by: body.reviewerId ?? null,
      review_notes: body.notes ?? null,
    })
    .eq("id", body.recordId);

  await client.from("explore_import_revisions").insert({
    job_id: record.job_id,
    record_id: body.recordId,
    entity_id: entityId,
    before_snapshot: beforeSnapshot,
    after_snapshot: entityValues,
    revision_type: beforeSnapshot ? "update" : "insert",
  });

  return json({ recordId: body.recordId, entityId, reviewStatus });
});
