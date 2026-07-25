import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-import-secret",
};

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

function cronMatches(schedule: string | null, date: Date): boolean {
  if (!schedule) return false;
  const parts = schedule.trim().split(/\s+/);
  if (parts.length !== 5) return false;
  const values = [
    date.getUTCMinutes(),
    date.getUTCHours(),
    date.getUTCDate(),
    date.getUTCMonth() + 1,
    date.getUTCDay(),
  ];
  return parts.every(
    (part, index) =>
      part === "*" || part.split(",").some((token) => Number(token) === values[index]),
  );
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
  if (!authorized(request)) return json({ error: "Unauthorized" }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const importSecret = Deno.env.get("EXPLORE_IMPORT_SECRET") ?? "";
  if (!supabaseUrl || !serviceRoleKey)
    return json({ error: "Supabase service configuration is missing" }, 500);

  const client = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
  const now = new Date();
  const { data: sources, error } = await client
    .from("explore_import_sources")
    .select("id,name,schedule,enabled")
    .eq("enabled", true);
  if (error) return json({ error: error.message }, 500);

  const due = (sources ?? []).filter((source) => cronMatches(source.schedule, now));
  const queued: Array<{ sourceId: string; jobId: string }> = [];
  const skipped: Array<{ sourceId: string; reason: string }> = [];

  for (const source of due) {
    const { data: active } = await client
      .from("explore_import_jobs")
      .select("id")
      .eq("source_id", source.id)
      .in("status", ["queued", "running"])
      .limit(1)
      .maybeSingle();
    if (active) {
      skipped.push({ sourceId: source.id, reason: "active_job_exists" });
      continue;
    }

    const { data: job, error: insertError } = await client
      .from("explore_import_jobs")
      .insert({
        source_id: source.id,
        mode: "scheduled",
        execution_mode: "live",
        status: "queued",
        statistics: {},
        warnings: [],
      })
      .select("id")
      .single();
    if (insertError || !job) {
      skipped.push({ sourceId: source.id, reason: insertError?.message ?? "job_creation_failed" });
      continue;
    }

    queued.push({ sourceId: source.id, jobId: job.id });
    const response = await fetch(`${supabaseUrl}/functions/v1/explore-import`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceRoleKey}`,
        "x-import-secret": importSecret,
      },
      body: JSON.stringify({ jobId: job.id }),
    });
    if (!response.ok) {
      const detail = await response.text();
      await client
        .from("explore_import_jobs")
        .update({
          status: "failed",
          completed_at: new Date().toISOString(),
          error: { message: `Unable to dispatch import: ${detail.slice(0, 500)}` },
        })
        .eq("id", job.id);
    }
  }

  return json({ checkedAt: now.toISOString(), due: due.length, queued, skipped });
});
