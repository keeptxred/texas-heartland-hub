import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-import-secret",
};

interface ImportRequest {
  jobId?: string;
  sourceId?: string;
  executionMode?: "live" | "dry-run" | "preview";
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
  const candidates = [payload.features, payload.results, payload.data, payload.items, payload.records];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate.filter(isRecord);
  }
  return [payload];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function pick(record: Record<string, unknown>, fields: string[]): unknown {
  for (const field of fields) {
    const value = record[field];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return undefined;
}

function normalize(raw: Record<string, unknown>, source: SourceRow): Record<string, unknown> {
  const properties = isRecord(raw.properties) ? raw.properties : raw;
  const geometry = isRecord(raw.geometry) ? raw.geometry : null;
  const coordinates = Array.isArray(geometry?.coordinates) ? geometry.coordinates : [];
  const longitude = Number(pick(properties, ["longitude", "lon", "lng", "x"]) ?? coordinates[0]);
  const latitude = Number(pick(properties, ["latitude", "lat", "y"]) ?? coordinates[1]);
  const externalId = String(pick(properties, ["external_id", "facility_id", "site_id", "park_id", "id", "OBJECTID", "objectid"]) ?? "");
  const name = String(pick(properties, ["name", "title", "park_name", "site_name", "facility_name", "location_name"]) ?? "").trim();
  const entityTypeBySource: Record<string, string> = {
    tpwd: "park", nps: "park", usace: "recreation_area", usfs: "public_land",
    thc: "historic_site", usgs: "natural_feature", noaa: "observation_station",
    twdb: "water_resource", osm: "place", county_gis: "place", municipality: "place",
    tourism: "attraction", custom: "place",
  };
  return {
    externalId,
    entityType: entityTypeBySource[source.source_type] ?? "place",
    name,
    description: pick(properties, ["description", "summary", "details"]) ?? null,
    latitude: Number.isFinite(latitude) ? latitude : null,
    longitude: Number.isFinite(longitude) ? longitude : null,
    address: pick(properties, ["address", "street_address"]) ?? null,
    taxonomy: [source.source_type],
    relationships: [],
    media: [],
    sourceUpdatedAt: pick(properties, ["updated_at", "modified", "last_updated"]) ?? null,
    sourceUrl: source.endpoint,
    metadata: properties,
    raw,
  };
}

function validate(record: Record<string, unknown>): Array<{ code: string; message: string; path: string; severity: "error" }> {
  const issues: Array<{ code: string; message: string; path: string; severity: "error" }> = [];
  if (!record.externalId) issues.push({ code: "missing_external_id", message: "A stable external identifier is required", path: "externalId", severity: "error" });
  if (!record.name) issues.push({ code: "missing_name", message: "Entity name is required", path: "name", severity: "error" });
  const latitude = record.latitude;
  const longitude = record.longitude;
  if (latitude !== null && (typeof latitude !== "number" || latitude < -90 || latitude > 90)) {
    issues.push({ code: "invalid_latitude", message: "Latitude must be between -90 and 90", path: "latitude", severity: "error" });
  }
  if (longitude !== null && (typeof longitude !== "number" || longitude < -180 || longitude > 180)) {
    issues.push({ code: "invalid_longitude", message: "Longitude must be between -180 and 180", path: "longitude", severity: "error" });
  }
  return issues;
}

async function fetchWithRetry(source: SourceRow): Promise<unknown> {
  const configuration = source.configuration ?? {};
  const url = new URL(source.endpoint);
  for (const [key, value] of Object.entries(configuration.query ?? {})) url.searchParams.set(key, String(value));
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
      if (!response.ok) throw new Error(`Source returned ${response.status} ${response.statusText}`);
      const contentType = response.headers.get("content-type") ?? "";
      return contentType.includes("json") ? await response.json() : JSON.parse(await response.text());
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
  if (!supabaseUrl || !serviceRoleKey) return json({ error: "Supabase service configuration is missing" }, 500);
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
    const { data: job, error } = await client.from("explore_import_jobs").select("id,source_id,execution_mode,status").eq("id", jobId).single();
    if (error || !job) return json({ error: error?.message ?? "Import job not found" }, 404);
    sourceId = job.source_id;
    if (["running", "completed", "completed_with_warnings"].includes(job.status)) {
      return json({ error: `Job cannot run from status ${job.status}` }, 409);
    }
  }

  if (!sourceId) return json({ error: "jobId or sourceId is required" }, 400);
  const { data: source, error: sourceError } = await client.from("explore_import_sources").select("*").eq("id", sourceId).single();
  if (sourceError || !source) return json({ error: sourceError?.message ?? "Import source not found" }, 404);
  if (!source.enabled) return json({ error: "Import source is disabled" }, 409);

  if (!jobId) {
    const { data: created, error } = await client.from("explore_import_jobs").insert({
      source_id: sourceId,
      mode: "manual",
      execution_mode: body.executionMode ?? "live",
      status: "queued",
      statistics: {},
      warnings: [],
    }).select("id").single();
    if (error || !created) return json({ error: error?.message ?? "Unable to create import job" }, 500);
    jobId = created.id;
  }

  const startedAt = new Date().toISOString();
  await client.from("explore_import_jobs").update({ status: "running", started_at: startedAt, heartbeat_at: startedAt }).eq("id", jobId);
  const statistics = { downloaded: 0, parsed: 0, normalized: 0, inserted: 0, updated: 0, unchanged: 0, duplicates: 0, validationErrors: 0, failed: 0 };
  const warnings: string[] = [];

  try {
    const payload = await fetchWithRetry(source as SourceRow);
    statistics.downloaded = 1;
    const records = getRecords(payload);
    statistics.parsed = records.length;

    for (let index = 0; index < records.length; index += 1) {
      const normalized = normalize(records[index], source as SourceRow);
      statistics.normalized += 1;
      const issues = validate(normalized);
      const digest = await checksum(normalized);
      const externalId = String(normalized.externalId);
      const { data: previous } = await client.from("explore_import_records")
        .select("checksum").eq("source_id", sourceId).eq("external_id", externalId)
        .order("created_at", { ascending: false }).limit(1).maybeSingle();
      const action = issues.length ? "reject" : previous?.checksum === digest ? "unchanged" : previous ? "update" : "insert";
      if (action === "reject") statistics.validationErrors += 1;
      else if (action === "insert") statistics.inserted += 1;
      else if (action === "update") statistics.updated += 1;
      else statistics.unchanged += 1;

      const { error } = await client.from("explore_import_records").insert({
        job_id: jobId,
        source_id: sourceId,
        external_id: externalId || `invalid-${index}`,
        action,
        checksum: digest,
        normalized_payload: normalized,
        raw_payload: records[index],
        validation_issues: issues,
        duplicate_candidates: [],
        review_status: action === "unchanged" ? "approved" : "pending",
      });
      if (error) {
        statistics.failed += 1;
        warnings.push(error.message);
      }
      if ((index + 1) % 25 === 0) {
        await client.from("explore_import_jobs").update({ statistics, warnings, heartbeat_at: new Date().toISOString() }).eq("id", jobId);
      }
    }

    const completedAt = new Date().toISOString();
    const status = warnings.length || statistics.validationErrors ? "completed_with_warnings" : "completed";
    await client.from("explore_import_jobs").update({ status, completed_at: completedAt, statistics, warnings }).eq("id", jobId);
    await client.from("explore_import_sources").update({ last_success_at: completedAt, consecutive_failures: 0, updated_at: completedAt }).eq("id", sourceId);
    return json({ jobId, sourceId, status, statistics, warnings });
  } catch (error) {
    const completedAt = new Date().toISOString();
    const message = error instanceof Error ? error.message : String(error);
    await client.from("explore_import_jobs").update({ status: "failed", completed_at: completedAt, statistics, warnings, error: { message } }).eq("id", jobId);
    const failures = Number(source.consecutive_failures ?? 0) + 1;
    await client.from("explore_import_sources").update({ last_failure_at: completedAt, consecutive_failures: failures, updated_at: completedAt }).eq("id", sourceId);
    return json({ jobId, sourceId, status: "failed", statistics, warnings, error: message }, 500);
  }
});
