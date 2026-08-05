import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import {
  classify,
  distanceKm,
  inTexas,
  isRecord as isPlainRecord,
  normalizedName,
  pick as pickField,
  slugify,
} from "../_shared/explore-classify.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-import-secret",
};

interface ImportRequest {
  jobId?: string;
  sourceId?: string;
  executionMode?: "live" | "dry-run" | "preview";
  limit?: number;
}

interface SourceRow {
  id: string;
  name: string;
  source_type: string;
  endpoint: string;
  enabled: boolean;
  configuration: {
    headers?: Record<string, string>;
    query?: Record<string, string>;
    auth?: { type?: string; secretName?: string };
    timeoutMs?: number;
    retry?: { attempts?: number; baseDelayMs?: number; maxDelayMs?: number };
  } | null;
  cursor: { field?: string; value?: string } | null;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function authorize(request: Request): boolean {
  const configured = Deno.env.get("EXPLORE_IMPORT_SECRET");
  if (!configured) return true;
  const direct = request.headers.get("x-import-secret");
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return direct === configured || bearer === configured;
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

async function checksum(value: unknown): Promise<string> {
  const bytes = new TextEncoder().encode(stableStringify(value));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function getRecords(payload: unknown): Record<string, unknown>[] {
  if (Array.isArray(payload)) return payload.filter(isRecord);
  if (!isRecord(payload)) return [];
  const candidates = [
    payload.features,
    payload.results,
    payload.data,
    payload.items,
    payload.records,
  ];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate.filter(isRecord);
  }
  return [payload];
}

const isRecord = isPlainRecord;
const pick = pickField;

function normalize(
  raw: Record<string, unknown>,
  source: SourceRow,
  allowedTypeKeys: Set<string>,
): Record<string, unknown> {
  const properties = isRecord(raw.properties) ? raw.properties : raw;
  const geometry = isRecord(raw.geometry) ? raw.geometry : null;
  const coordinates = Array.isArray(geometry?.coordinates) ? geometry.coordinates : [];
  const longitude = Number(
    pick(properties, ["longitude", "lon", "lng", "ddx", "x"]) ?? coordinates[0],
  );
  const latitude = Number(pick(properties, ["latitude", "lat", "ddy", "y"]) ?? coordinates[1]);
  const externalId = String(
    pick(properties, [
      "external_id",
      "locode",
      "parkcode",
      "unit_code",
      "facility_id",
      "site_id",
      "park_id",
      "id",
      "OBJECTID",
      "objectid",
    ]) ?? "",
  );
  const rawName = String(
    pick(properties, [
      "name",
      "title",
      "fullname",
      "park_name",
      "site_name",
      "facility_name",
      "location_name",
    ]) ?? "",
  ).trim();
  // Some authoritative feeds publish a bare place name plus a separate
  // designation field ("Abilene" + "State Park"). Compose a display name so
  // slugs and titles are unambiguous.
  const designation = String(
    pick(properties, ["Type", "type", "designation", "unit_type", "park_type"]) ?? "",
  ).trim();
  const name =
    rawName && designation && !rawName.toLowerCase().includes(designation.toLowerCase())
      ? `${rawName} ${designation}`
      : rawName;
  // Record-aware classification: feature/facility type and designation first,
  // then the record name, and only then a per-source fallback (which is always
  // reported as unconfident so the record stays pending for human review).
  const classification = classify(properties, source.source_type, allowedTypeKeys);
  const lat = Number.isFinite(latitude) ? latitude : null;
  const lng = Number.isFinite(longitude) ? longitude : null;
  return {
    externalId,
    entityType: classification.entityType,
    classificationConfident: classification.confident,
    classificationSignal: classification.signal,
    name,
    normalizedName: normalizedName(name),
    slug: name ? slugify(name) : undefined,
    description: pick(properties, ["description", "summary", "details"]) ?? null,
    latitude: lat,
    longitude: lng,
    inTexas: inTexas(lat, lng),
    address: {
      line1: pick(properties, ["address", "street_address", "street", "address_line_1"]) ?? null,
      city: pick(properties, ["city", "municipality", "town"]) ?? null,
      county: pick(properties, ["county", "county_name"]) ?? null,
      postalCode: pick(properties, ["zip", "zipcode", "postal_code", "postalcode"]) ?? null,
      phone: pick(properties, ["phone", "telephone", "phone_number"]) ?? null,
    },
    officialUrl: pick(properties, ["url", "website", "web", "link"]) ?? null,
    taxonomy: [source.source_type, classification.entityType],
    relationships: [],
    media: [],
    sourceUpdatedAt: pick(properties, ["updated_at", "modified", "last_updated"]) ?? null,
    sourceUrl: pick(properties, ["url", "website", "link"]) ?? source.endpoint,
    metadata: properties,
    raw,
  };
}

function validate(
  record: Record<string, unknown>,
): Array<{ code: string; message: string; path: string; severity: "error" }> {
  const issues: Array<{ code: string; message: string; path: string; severity: "error" }> = [];
  if (!record.externalId)
    issues.push({
      code: "missing_external_id",
      message: "A stable external identifier is required",
      path: "externalId",
      severity: "error",
    });
  if (!record.name)
    issues.push({
      code: "missing_name",
      message: "Entity name is required",
      path: "name",
      severity: "error",
    });
  const latitude = record.latitude;
  const longitude = record.longitude;
  if (latitude !== null && (typeof latitude !== "number" || latitude < -90 || latitude > 90)) {
    issues.push({
      code: "invalid_latitude",
      message: "Latitude must be between -90 and 90",
      path: "latitude",
      severity: "error",
    });
  }
  if (
    longitude !== null &&
    (typeof longitude !== "number" || longitude < -180 || longitude > 180)
  ) {
    issues.push({
      code: "invalid_longitude",
      message: "Longitude must be between -180 and 180",
      path: "longitude",
      severity: "error",
    });
  }
  if (!record.inTexas) {
    issues.push({
      code: "coordinates_outside_texas",
      message: "Coordinates are missing, 0,0, or outside Texas bounds",
      path: "latitude",
      severity: "error",
    });
  }
  return issues;
}

async function fetchWithRetry(source: SourceRow): Promise<unknown> {
  const configuration = source.configuration ?? {};
  const url = new URL(source.endpoint);
  for (const [key, value] of Object.entries(configuration.query ?? {}))
    url.searchParams.set(key, String(value));
  if (source.cursor?.field && source.cursor.value) {
    url.searchParams.set(source.cursor.field, source.cursor.value);
  }

  const headers = new Headers(configuration.headers ?? {});
  headers.set("accept", headers.get("accept") ?? "application/json");
  const auth = configuration.auth;
  if (auth?.type && auth.type !== "none") {
    const secretName = auth.secretName;
    const secret = secretName ? Deno.env.get(secretName) : undefined;
    if (!secret) throw new Error(`Missing configured secret ${secretName ?? "unknown"}`);
    if (auth.type === "bearer") headers.set("authorization", `Bearer ${secret}`);
    if (auth.type === "api-key") headers.set("x-api-key", secret);
    if (auth.type === "basic") headers.set("authorization", `Basic ${btoa(secret)}`);
  }

  const retry = configuration.retry ?? {};
  const attempts = Math.max(1, Number(retry.attempts ?? 3));
  const baseDelay = Math.max(100, Number(retry.baseDelayMs ?? 500));
  const maxDelay = Math.max(baseDelay, Number(retry.maxDelayMs ?? 10_000));
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), configuration.timeoutMs ?? 30_000);
    try {
      const response = await fetch(url, { headers, signal: controller.signal });
      if (!response.ok)
        throw new Error(`Source returned ${response.status} ${response.statusText}`);
      const contentType = response.headers.get("content-type") ?? "";
      return contentType.includes("json")
        ? await response.json()
        : JSON.parse(await response.text());
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        const delay = Math.min(maxDelay, baseDelay * 2 ** (attempt - 1));
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
  if (!authorize(request)) return json({ error: "Unauthorized" }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey)
    return json({ error: "Supabase service configuration is missing" }, 500);
  const client = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

  let body: ImportRequest;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON request body" }, 400);
  }

  let jobId = body.jobId;
  let sourceId = body.sourceId;
  if (jobId) {
    const { data: job, error } = await client
      .from("explore_import_jobs")
      .select("id,source_id,execution_mode,status")
      .eq("id", jobId)
      .single();
    if (error || !job) return json({ error: error?.message ?? "Import job not found" }, 404);
    sourceId = job.source_id;
    if (["running", "completed", "completed_with_warnings"].includes(job.status)) {
      return json({ error: `Job cannot run from status ${job.status}` }, 409);
    }
  }

  if (!sourceId) return json({ error: "jobId or sourceId is required" }, 400);
  const { data: source, error: sourceError } = await client
    .from("explore_import_sources")
    .select("*")
    .eq("id", sourceId)
    .single();
  if (sourceError || !source)
    return json({ error: sourceError?.message ?? "Import source not found" }, 404);
  if (!source.enabled) return json({ error: "Import source is disabled" }, 409);

  if (!jobId) {
    const { data: created, error } = await client
      .from("explore_import_jobs")
      .insert({
        source_id: sourceId,
        mode: "manual",
        execution_mode: body.executionMode ?? "live",
        status: "queued",
        statistics: {},
        warnings: [],
      })
      .select("id")
      .single();
    if (error || !created)
      return json({ error: error?.message ?? "Unable to create import job" }, 500);
    jobId = created.id;
  }

  const startedAt = new Date().toISOString();
  await client
    .from("explore_import_jobs")
    .update({ status: "running", started_at: startedAt, heartbeat_at: startedAt })
    .eq("id", jobId);
  const statistics = {
    downloaded: 0,
    parsed: 0,
    normalized: 0,
    inserted: 0,
    updated: 0,
    unchanged: 0,
    duplicates: 0,
    validationErrors: 0,
    failed: 0,
    pendingReview: 0,
    unconfidentClassification: 0,
  };
  const warnings: string[] = [];

  try {
    const { data: typeRows } = await client
      .from("explore_entity_types")
      .select("key")
      .eq("is_active", true);
    const allowedTypeKeys = new Set((typeRows ?? []).map((row) => String(row.key)));

    const payload = await fetchWithRetry(source as SourceRow);
    statistics.downloaded = 1;
    const allRecords = getRecords(payload);
    // `limit` bounds a smoke test / limited live run without touching the source config.
    const cap = Number(body.limit ?? 0);
    const records = cap > 0 ? allRecords.slice(0, cap) : allRecords;
    statistics.parsed = records.length;

    for (let index = 0; index < records.length; index += 1) {
      const normalized = normalize(records[index], source as SourceRow, allowedTypeKeys);
      statistics.normalized += 1;
      const issues = validate(normalized);
      const digest = await checksum(normalized);
      const externalId = String(normalized.externalId);
      const { data: previous } = await client
        .from("explore_import_records")
        .select("checksum,entity_id")
        .eq("source_id", sourceId)
        .eq("external_id", externalId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      // Dedup: same normalized name + entity type, or a public entity within
      // 1km of the same name. Never merged automatically — recorded as a
      // candidate so the record stays pending for a human decision.
      const duplicateCandidates: Array<Record<string, unknown>> = [];
      if (!issues.length && !previous) {
        const { data: nameMatches } = await client
          .from("explore_entities")
          .select("id,name,slug,status,visibility,explore_locations(latitude,longitude)")
          .ilike("name", String(normalized.name))
          .limit(5);
        for (const match of nameMatches ?? []) {
          const location = Array.isArray(match.explore_locations)
            ? match.explore_locations[0]
            : match.explore_locations;
          const km =
            location && normalized.latitude && normalized.longitude
              ? distanceKm(
                  Number(normalized.latitude),
                  Number(normalized.longitude),
                  Number(location.latitude),
                  Number(location.longitude),
                )
              : null;
          duplicateCandidates.push({
            entityId: match.id,
            slug: match.slug,
            matchedOn: km !== null && km <= 1 ? "name_and_proximity" : "name",
            distanceKm: km,
          });
        }
      }
      if (duplicateCandidates.length) statistics.duplicates += 1;
      if (!normalized.classificationConfident) statistics.unconfidentClassification += 1;

      const action = issues.length
        ? "reject"
        : previous?.checksum === digest
          ? "unchanged"
          : previous
            ? "update"
            : "insert";
      if (action === "reject") statistics.validationErrors += 1;
      else if (action === "insert") statistics.inserted += 1;
      else if (action === "update") statistics.updated += 1;
      else statistics.unchanged += 1;

      // Approval state: invalid -> rejected. Duplicate candidates or an
      // unconfident classification -> pending. Clean authoritative records ->
      // pending only until the batch approval path promotes them.
      const reviewStatus =
        action === "reject"
          ? "rejected"
          : action === "unchanged"
            ? "approved"
            : "pending";
      if (reviewStatus === "pending") statistics.pendingReview += 1;

      // Dry runs inspect normalization without writing import records.
      if ((body.executionMode ?? "live") !== "live") {
        if (index < 10) warnings.push(`dry-run sample: ${JSON.stringify({
          externalId,
          name: normalized.name,
          entityType: normalized.entityType,
          confident: normalized.classificationConfident,
          signal: normalized.classificationSignal,
          latitude: normalized.latitude,
          longitude: normalized.longitude,
          county: (normalized.address as Record<string, unknown>)?.county ?? null,
          action,
          reviewStatus,
        })}`);
        continue;
      }

      const { error } = await client.from("explore_import_records").insert({
        job_id: jobId,
        source_id: sourceId,
        external_id: externalId || `invalid-${index}`,
        action,
        checksum: digest,
        previous_checksum: previous?.checksum ?? null,
        normalized_payload: normalized,
        raw_payload: records[index],
        validation_issues: issues,
        duplicate_candidates: duplicateCandidates,
        review_status: reviewStatus,
        entity_id: previous?.entity_id ?? null,
      });
      if (error) {
        statistics.failed += 1;
        warnings.push(error.message);
      }
      if ((index + 1) % 25 === 0) {
        await client
          .from("explore_import_jobs")
          .update({ statistics, warnings, heartbeat_at: new Date().toISOString() })
          .eq("id", jobId);
      }
    }

    const completedAt = new Date().toISOString();
    const status =
      warnings.length || statistics.validationErrors ? "completed_with_warnings" : "completed";
    await client
      .from("explore_import_jobs")
      .update({ status, completed_at: completedAt, statistics, warnings })
      .eq("id", jobId);
    await client
      .from("explore_import_sources")
      .update({ last_success_at: completedAt, consecutive_failures: 0, updated_at: completedAt })
      .eq("id", sourceId);
    return json({ jobId, sourceId, status, statistics, warnings });
  } catch (error) {
    const completedAt = new Date().toISOString();
    const message = error instanceof Error ? error.message : String(error);
    await client
      .from("explore_import_jobs")
      .update({
        status: "failed",
        completed_at: completedAt,
        statistics,
        warnings,
        error: { message },
      })
      .eq("id", jobId);
    const failures = Number(source.consecutive_failures ?? 0) + 1;
    await client
      .from("explore_import_sources")
      .update({
        last_failure_at: completedAt,
        consecutive_failures: failures,
        updated_at: completedAt,
      })
      .eq("id", sourceId);
    return json({ jobId, sourceId, status: "failed", statistics, warnings, error: message }, 500);
  }
});
