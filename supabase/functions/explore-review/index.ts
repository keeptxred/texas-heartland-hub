import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { inTexas, slugify } from "../_shared/explore-classify.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-import-secret",
};

type ReviewAction = "approve" | "reject" | "merge" | "rollback" | "batch-approve";

interface ReviewRequest {
  action: ReviewAction;
  recordId?: string;
  jobId?: string;
  targetEntityId?: string;
  reviewerId?: string;
  notes?: string;
  limit?: number;
  /** When false, approved records stay internal/reviewed instead of public/verified. */
  promote?: boolean;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// Service-role / import-secret only. Never anonymous: when a secret is
// configured every request must present it (batch approval included).
function authorized(request: Request): boolean {
  const configured = Deno.env.get("EXPLORE_IMPORT_SECRET");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const direct = request.headers.get("x-import-secret");
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (serviceRoleKey && (direct === serviceRoleKey || bearer === serviceRoleKey)) return true;
  if (!configured) return !direct && !bearer ? true : false;
  return direct === configured || bearer === configured;
}

type Client = ReturnType<typeof createClient>;

const PARK_TYPES = new Set([
  "state_park",
  "national_park",
  "national_monument",
  "national_preserve",
  "national_seashore",
  "natural_area",
  "wildlife_refuge",
  "historic_site",
]);
const LAKE_TYPES = new Set(["lake", "reservoir"]);

async function uniqueSlug(client: Client, base: string, entityId: string | null): Promise<string> {
  let slug = base;
  for (let suffix = 2; suffix < 1000; suffix += 1) {
    const { data: match } = await client
      .from("explore_entities")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!match || match.id === entityId) return slug;
    slug = `${base}-${suffix}`;
  }
  return slug;
}

interface PromotionResult {
  entityId: string;
  slug: string;
  status: string;
  visibility: string;
  revisionType: "insert" | "update";
}

/**
 * Promotes an approved import record into the live catalog: entity row,
 * location, provenance source, profile table, categories, search index, and
 * version/revision audit rows.
 */
async function promoteRecord(
  client: Client,
  record: Record<string, unknown>,
  options: { reviewerId?: string; notes?: string; targetEntityId?: string; promote: boolean; merge: boolean },
): Promise<PromotionResult> {
  const draft = record.normalized_payload as Record<string, unknown>;
  const entityTypeKey = String(draft.entityType ?? "");
  const { data: entityType, error: typeError } = await client
    .from("explore_entity_types")
    .select("id,key,name")
    .eq("key", entityTypeKey)
    .maybeSingle();
  if (typeError) throw new Error(typeError.message);
  if (!entityType) throw new Error(`Unknown Explore entity type ${entityTypeKey}`);

  const latitude = draft.latitude === null ? null : Number(draft.latitude);
  const longitude = draft.longitude === null ? null : Number(draft.longitude);
  const coordinatesValid = inTexas(latitude, longitude);
  if (!coordinatesValid) throw new Error("Coordinates are missing or outside Texas bounds");
  if (!draft.name) throw new Error("Record has no name");
  if (!record.external_id) throw new Error("Record has no stable external id");

  let entityId = (options.targetEntityId ?? record.entity_id ?? null) as string | null;
  let beforeSnapshot: Record<string, unknown> | null = null;
  if (entityId) {
    const { data: existing } = await client
      .from("explore_entities")
      .select("*")
      .eq("id", entityId)
      .maybeSingle();
    if (!existing) entityId = null;
    else beforeSnapshot = existing as Record<string, unknown>;
  }

  const slug = await uniqueSlug(
    client,
    slugify(String(draft.slug ?? draft.name)),
    entityId,
  );
  const now = new Date().toISOString();
  // Clean authoritative records go straight to public + verified, which is the
  // only combination TexasDefined can read with the anon key.
  const status = options.promote ? "verified" : "reviewed";
  const visibility = options.promote ? "public" : "internal";
  const description = draft.description ? String(draft.description) : null;

  const entityValues: Record<string, unknown> = {
    entity_type_id: entityType.id,
    name: String(draft.name),
    slug,
    short_description: description ? description.slice(0, 320) : null,
    long_description: description,
    summary: description ? description.slice(0, 1000) : null,
    status,
    visibility,
    source_confidence: 95,
    published_at: options.promote ? now : null,
    verified_at: options.promote ? now : null,
  };

  let entityRow: Record<string, unknown>;
  let revisionType: "insert" | "update";
  if (entityId) {
    const nextVersion = Number(beforeSnapshot?.version ?? 1) + 1;
    const { data: updated, error } = await client
      .from("explore_entities")
      .update({ ...entityValues, version: nextVersion })
      .eq("id", entityId)
      .select("*")
      .single();
    if (error || !updated) throw new Error(error?.message ?? "Entity update failed");
    entityRow = updated as Record<string, unknown>;
    revisionType = "update";
    await client.from("explore_entity_versions").insert({
      entity_id: entityId,
      version: nextVersion,
      snapshot: updated,
      change_summary: `Updated from ${record.external_id}`,
      change_source: "import",
      changed_by_user_id: options.reviewerId ?? null,
    });
  } else {
    const { data: inserted, error } = await client
      .from("explore_entities")
      .insert(entityValues)
      .select("*")
      .single();
    if (error || !inserted) throw new Error(error?.message ?? "Entity creation failed");
    entityRow = inserted as Record<string, unknown>;
    entityId = String(inserted.id);
    revisionType = "insert";
    await client.from("explore_entity_versions").insert({
      entity_id: entityId,
      version: 1,
      snapshot: inserted,
      change_summary: `Created from ${record.external_id}`,
      change_source: "import",
      changed_by_user_id: options.reviewerId ?? null,
    });
  }

  // Location: coordinates must live in explore_locations, not only raw JSON.
  const address = (draft.address ?? {}) as Record<string, unknown>;
  const { data: existingLocation } = await client
    .from("explore_locations")
    .select("id")
    .eq("entity_id", entityId)
    .maybeSingle();
  const locationValues = {
    entity_id: entityId,
    address_line_1: address.line1 ? String(address.line1) : null,
    city: address.city ? String(address.city) : null,
    county: address.county ? String(address.county) : null,
    state_code: "TX",
    postal_code: address.postalCode ? String(address.postalCode).slice(0, 10) : null,
    latitude,
    longitude,
    map_metadata: {
      phone: address.phone ?? null,
      official_url: draft.officialUrl ?? null,
      source_external_id: record.external_id,
    },
  };
  if (existingLocation) {
    await client.from("explore_locations").update(locationValues).eq("id", existingLocation.id);
  } else {
    await client.from("explore_locations").insert(locationValues);
  }

  // Provenance: authoritative source + retrieval/verification timestamps.
  const source = record.explore_import_sources as Record<string, unknown> | null;
  if (source) {
    const sourceName = String(source.name ?? source.source_type ?? "Imported source");
    const { data: provenanceSource } = await client
      .from("explore_sources")
      .upsert(
        {
          name: sourceName,
          source_type: "government",
          base_url: source.endpoint ? new URL(String(source.endpoint)).origin : null,
          publisher: sourceName,
          default_confidence: 95,
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
          source_url: (draft.sourceUrl ?? source.endpoint ?? null) as string | null,
          external_id: record.external_id,
          confidence: 95,
          retrieved_at: record.created_at,
          verified_at: options.promote ? now : null,
          raw_metadata: (draft.metadata ?? {}) as Record<string, unknown>,
        },
        { onConflict: "entity_id,source_id,external_id,source_url" },
      );
    }
  }

  // Profile tables for park-like and lake-like destinations.
  if (PARK_TYPES.has(entityTypeKey)) {
    await client.from("explore_park_profiles").upsert(
      {
        entity_id: entityId,
        park_type: entityType.name,
        managing_authority: String(
          (record.explore_import_sources as Record<string, unknown> | null)?.name ?? "",
        ) || null,
        official_park_id: String(record.external_id),
        reservations_url: (draft.officialUrl ?? null) as string | null,
        profile_metadata: { classification_signal: draft.classificationSignal ?? null },
      },
      { onConflict: "entity_id" },
    );
  } else if (LAKE_TYPES.has(entityTypeKey)) {
    await client.from("explore_lake_profiles").upsert(
      {
        entity_id: entityId,
        reservoir: entityTypeKey === "reservoir",
        managing_authority: String(
          (record.explore_import_sources as Record<string, unknown> | null)?.name ?? "",
        ) || null,
        profile_metadata: { classification_signal: draft.classificationSignal ?? null },
      },
      { onConflict: "entity_id" },
    );
  }

  // Category: one per entity type key, created on demand and marked primary.
  const { data: category } = await client
    .from("explore_categories")
    .upsert(
      {
        key: entityTypeKey,
        name: String(entityType.name),
        slug: slugify(String(entityType.name)),
        is_active: true,
      },
      { onConflict: "key" },
    )
    .select("id")
    .single();
  if (category) {
    await client
      .from("explore_entity_categories")
      .upsert(
        { entity_id: entityId, category_id: category.id, is_primary: true },
        { onConflict: "entity_id,category_id" },
      );
  }

  // Search index row mirrors visibility/status so anon search stays consistent.
  const locationText = [address.city, address.county, "Texas"]
    .filter(Boolean)
    .map(String)
    .join(", ");
  await client.from("explore_search_index").upsert(
    {
      entity_id: entityId,
      entity_type_key: entityTypeKey,
      name: String(draft.name),
      slug,
      alternate_names: [],
      category_names: [String(entityType.name)],
      tag_names: [],
      location_text: locationText,
      searchable_text: [draft.name, description, locationText].filter(Boolean).join(" "),
      source_confidence: 95,
      visibility,
      status,
      indexed_at: now,
    },
    { onConflict: "entity_id" },
  );

  const reviewStatus = options.merge ? "merged" : "approved";
  await client
    .from("explore_import_records")
    .update({
      entity_id: entityId,
      review_status: reviewStatus,
      reviewed_at: now,
      reviewed_by: options.reviewerId ?? null,
      review_notes: options.notes ?? null,
    })
    .eq("id", record.id as string);

  await client.from("explore_import_revisions").insert({
    job_id: record.job_id,
    record_id: record.id,
    entity_id: entityId,
    before_snapshot: beforeSnapshot,
    after_snapshot: entityRow,
    revision_type: revisionType,
  });

  return {
    entityId: String(entityId),
    slug,
    status,
    visibility,
    revisionType,
  };
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

  // Service-role-only batch approval for one job, with per-job counts.
  if (body.action === "batch-approve") {
    if (!body.jobId) return json({ error: "jobId is required for batch-approve" }, 400);
    const limit = Math.min(Math.max(Number(body.limit ?? 200), 1), 500);
    const { data: records, error } = await client
      .from("explore_import_records")
      .select("*,explore_import_sources(*)")
      .eq("job_id", body.jobId)
      .eq("review_status", "pending")
      .order("created_at", { ascending: true })
      .limit(limit);
    if (error) return json({ error: error.message }, 500);

    const counts = { inserted: 0, updated: 0, unchanged: 0, rejected: 0, skipped: 0, failed: 0 };
    const failures: Array<{ recordId: string; message: string }> = [];
    const promotedSlugs: string[] = [];

    for (const record of records ?? []) {
      const issues = (record.validation_issues ?? []) as unknown[];
      const duplicates = (record.duplicate_candidates ?? []) as unknown[];
      const draft = (record.normalized_payload ?? {}) as Record<string, unknown>;

      if (issues.length || !draft.name || !record.external_id) {
        await client
          .from("explore_import_records")
          .update({
            review_status: "rejected",
            reviewed_at: new Date().toISOString(),
            reviewed_by: body.reviewerId ?? null,
            review_notes: "Batch: failed validation or missing name/source id",
          })
          .eq("id", record.id);
        counts.rejected += 1;
        continue;
      }
      // Duplicate candidates and uncertain classifications stay pending for a human.
      if (duplicates.length || draft.classificationConfident === false) {
        counts.skipped += 1;
        continue;
      }
      if (record.action === "unchanged") {
        counts.unchanged += 1;
        continue;
      }

      try {
        const result = await promoteRecord(client, record as Record<string, unknown>, {
          reviewerId: body.reviewerId,
          notes: body.notes ?? "Batch approval",
          promote: body.promote !== false,
          merge: false,
        });
        if (result.revisionType === "insert") counts.inserted += 1;
        else counts.updated += 1;
        if (promotedSlugs.length < 10) promotedSlugs.push(result.slug);
      } catch (promotionError) {
        counts.failed += 1;
        failures.push({
          recordId: String(record.id),
          message:
            promotionError instanceof Error ? promotionError.message : String(promotionError),
        });
      }
    }

    return json({ jobId: body.jobId, counts, failures, sampleSlugs: promotedSlugs });
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

  try {
    const result = await promoteRecord(client, record as Record<string, unknown>, {
      reviewerId: body.reviewerId,
      notes: body.notes,
      targetEntityId: body.targetEntityId,
      promote: body.promote !== false,
      merge: body.action === "merge",
    });
    return json({
      recordId: body.recordId,
      reviewStatus: body.action === "merge" ? "merged" : "approved",
      ...result,
    });
  } catch (promotionError) {
    const message =
      promotionError instanceof Error ? promotionError.message : String(promotionError);
    return json({ recordId: body.recordId, error: message }, 422);
  }
});
