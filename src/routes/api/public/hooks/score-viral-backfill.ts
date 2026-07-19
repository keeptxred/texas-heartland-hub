// Backfill scorer: runs the existing viral scorer against feed rows that
// have never been scored (viral_scored_at IS NULL). Reuses the same logic
// as score-viral.ts — no scoring changes, no publishing, no generation.
import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import {
  scoreFeedItem,
  classifySourceReputation,
  qualifiesReadyForRewrite,
} from "@/lib/viral-score";

export const Route = createFileRoute("/api/public/hooks/score-viral-backfill")({
  server: {
    handlers: {
      GET: async ({ request }) => scoreUnscored(request),
      POST: async ({ request }) => scoreUnscored(request),
    },
  },
});

async function scoreUnscored(request: Request) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return json({ ok: false, error: "server not configured" }, 500);

  const u = new URL(request.url);
  const limit = Math.min(Math.max(parseInt(u.searchParams.get("limit") || "500", 10) || 500, 1), 2000);

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase
    .from("texas_news_feed")
    .select("id,title,source,link,pub_date,description,viral_score")
    .is("viral_scored_at", null)
    .order("pub_date", { ascending: false })
    .limit(limit);

  if (error) return json({ ok: false, error: error.message }, 500);
  const rows = (data ?? []) as Array<{
    id: number;
    title: string;
    source: string;
    link: string | null;
    pub_date: string;
    description: string | null;
    viral_score: number | null;
  }>;

  const { data: srcs } = await supabase
    .from("content_sources")
    .select("source_name,source_reputation_score,source_quality_reason");
  const repOverride = new Map<string, { score: number; reason: string }>();
  (srcs ?? []).forEach((s: { source_name: string | null; source_reputation_score: number | null; source_quality_reason: string | null }) => {
    if (s.source_name && s.source_reputation_score != null) {
      repOverride.set(s.source_name.toLowerCase(), {
        score: s.source_reputation_score,
        reason: s.source_quality_reason || "content_sources override",
      });
    }
  });

  const clusters = new Map<string, number>();
  const clusterKey = (t: string) =>
    (t ?? "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3)
      .slice(0, 6)
      .join(" ");
  rows.forEach((r) => {
    const k = clusterKey(r.title);
    if (!k) return;
    clusters.set(k, (clusters.get(k) ?? 0) + 1);
  });

  const VIDEO_RE = /(youtube\.com|youtu\.be|tiktok\.com|instagram\.com\/reel|twitter\.com\/.+\/status|x\.com\/.+\/status|\.mp4|video)/i;
  const now = new Date().toISOString();
  let updated = 0;
  let readyFlagged = 0;

  for (const row of rows) {
    const rep =
      repOverride.get((row.source || "").toLowerCase()) ??
      classifySourceReputation(row.source || "");
    const hasVideo = VIDEO_RE.test(`${row.link ?? ""} ${row.description ?? ""}`);
    const r = scoreFeedItem({
      ...row,
      has_video: hasVideo,
      source_reputation_score: rep.score,
      source_reputation_reason: rep.reason,
    });

    const key = clusterKey(row.title);
    const sourceCount = key ? clusters.get(key) ?? 1 : 1;
    const prior = row.viral_score ?? 0;
    const trendVelocity = Number(((r.viralScore - prior) + (sourceCount - 1) * 5).toFixed(2));
    const readyForRewrite = qualifiesReadyForRewrite(r);
    if (readyForRewrite) readyFlagged += 1;

    const { error: upErr } = await supabase
      .from("texas_news_feed")
      .update({
        viral_score: r.viralScore,
        classification_confidence: r.classificationConfidence,
        viral_signals: {
          ...r.signals,
          source_reputation_reason: r.sourceReputationReason,
          has_video: hasVideo,
        },
        texas_relevance_score: r.texasRelevanceScore,
        source_reputation_score: r.sourceReputationScore,
        routing_type: r.routingType,
        trend_velocity: trendVelocity,
        source_count: sourceCount,
        ready_for_rewrite: readyForRewrite,
        viral_scored_at: now,
      })
      .eq("id", row.id);
    if (!upErr) updated += 1;
  }

  const { count: remaining } = await supabase
    .from("texas_news_feed")
    .select("id", { count: "exact", head: true })
    .is("viral_scored_at", null);

  return json({ ok: true, scanned: rows.length, updated, readyFlagged, remaining: remaining ?? 0 });
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}