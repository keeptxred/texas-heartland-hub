import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const ALLOWED = new Set(["backfill", "normalize", "sync", "catalog", "enrich"]);

Deno.serve(async (request) => {
  if (request.method !== "POST") {
    return Response.json({ error: "POST required" }, { status: 405 });
  }

  const base = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!base || !serviceKey) {
    return Response.json({ error: "Supabase configuration missing" }, { status: 500 });
  }

  const token = request.headers.get("x-ktr-tlo-sync") || "";
  const db = createClient(base, serviceKey, { auth: { persistSession: false } });
  const { data: valid, error: verifyError } = await db.rpc("verify_tlo_sync_token", {
    p_token: token,
  });
  if (verifyError || !valid) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: any = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const action = typeof body.action === "string" ? body.action : "sync";
  if (!ALLOWED.has(action)) {
    return Response.json({ error: "Unsupported action" }, { status: 400 });
  }

  const slug = action === "backfill"
    ? "tlo-missing-bill-backfill"
    : action === "normalize"
      ? "normalize-tlo-bill-sponsors"
      : action === "catalog"
        ? "tlo-filed-catalog-sync"
        : action === "enrich"
          ? "tlo-seed-bill-enrichment"
          : "tlo-rss-bill-sync";

  const safeBillIds = Array.isArray(body.bill_ids)
    ? body.bill_ids.filter((value: unknown) => typeof value === "string" && /^[0-9a-f-]{36}$/i.test(value)).slice(0, 20)
    : [];

  const downstreamBody = action === "catalog"
    ? {
        source: "tlo-bill-sync-trigger",
        session: typeof body.session === "string" ? body.session : "89R",
        dry_run: body.dry_run !== false,
      }
    : action === "enrich"
      ? {
          source: "tlo-bill-sync-trigger",
          limit: Math.max(1, Math.min(Number(body.limit) || 10, 20)),
          bill_ids: safeBillIds,
        }
      : { source: "tlo-bill-sync-trigger" };

  const response = await fetch(`${base}/functions/v1/${slug}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${serviceKey}`,
      apikey: serviceKey,
    },
    body: JSON.stringify(downstreamBody),
  });

  const text = await response.text();
  return new Response(text, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("content-type") || "application/json",
    },
  });
});