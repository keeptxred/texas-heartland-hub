import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { scoreFeedItem } from "@/lib/viral-score";

// Recomputes viral_score / classification_confidence / viral_signals for
// the most recent feed rows. Deterministic, no external trend APIs.
// Safe to call frequently (pg_cron every 15 min).
export const Route = createFileRoute("/api/public/hooks/score-viral")({
  server: {
    handlers: {
      GET: async () => scoreRecent(),
      POST: async () => scoreRecent(),
    },
  },
});

async function scoreRecent() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return json({ ok: false, error: "server not configured" }, 500);

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const sinceIso = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("texas_news_feed")
    .select("id,title,source,pub_date,description")
    .gte("pub_date", sinceIso)
    .order("pub_date", { ascending: false })
    .limit(200);

  if (error) return json({ ok: false, error: error.message }, 500);
  const rows = data ?? [];
  const now = new Date().toISOString();
  let updated = 0;

  for (const row of rows) {
    const r = scoreFeedItem(row);
    const { error: upErr } = await supabase
      .from("texas_news_feed")
      .update({
        viral_score: r.viralScore,
        classification_confidence: r.classificationConfidence,
        viral_signals: r.signals,
        viral_scored_at: now,
      })
      .eq("id", row.id);
    if (!upErr) updated += 1;
  }

  return json({ ok: true, scanned: rows.length, updated });
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}