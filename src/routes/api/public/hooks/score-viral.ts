import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import {
  scoreFeedItem,
  classifySourceReputation,
  qualifiesReadyForRewrite,
  VIRAL_READY_MIN_SCORE,
} from "@/lib/viral-score";
import { isLowValueTitle } from "@/lib/low-value-titles";

// Refreshes ingestion first, then recomputes viral scoring for recent feed rows.
// This makes the admin "Rescore Now" action a true newsroom refresh instead of
// merely recalculating stale rows that were already in texas_news_feed.
export const Route = createFileRoute("/api/public/hooks/score-viral")({
  server: {
    handlers: {
      GET: async ({ request }) => scoreRecent(request),
      POST: async ({ request }) => scoreRecent(request),
    },
  },
});

async function scoreRecent(request: Request) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return json({ ok: false, error: "server not configured" }, 500);

  // Pull fresh RSS rows before scoring. Ingestion is storage-only and does not
  // invoke paid AI rewrites, so this is safe for the manual refresh button.
  let ingest: Record<string, unknown> | null = null;
  try {
    const ingestUrl = new URL("/api/public/hooks/ingest-feeds", request.url);
    const ingestResponse = await fetch(ingestUrl, { method: "POST" });
    ingest = (await ingestResponse.json()) as Record<string, unknown>;
  } catch (error) {
    ingest = { ok: false, error: error instanceof Error ? error.message : "ingest failed" };
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const sinceIso = new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("texas_news_feed")
    .select("id,title,source,link,pub_date,description,viral_score,internal_slug")
    .gte("pub_date", sinceIso)
    .order("pub_date", { ascending: false })
    .limit(300);

  if (error) return json({ ok: false, error: error.message, ingest }, 500);
  const rows = (data ?? []) as Array<{
    id: number;
    title: string;
    source: string;
    link: string | null;
    pub_date: string;
    description: string | null;
    viral_score: number | null;
    internal_slug: string | null;
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
    if (isLowValueTitle(r.title)) return;
    const k = clusterKey(r.title);
    if (!k) return;
    clusters.set(k, (clusters.get(k) ?? 0) + 1);
  });

  const now = new Date().toISOString();
  let updated = 0;
  let readyFlagged = 0;
  let reelsQueued = 0;
  let removedMediaStubs = 0;

  const VIDEO_RE = /(youtube\.com|youtu\.be|tiktok\.com|instagram\.com\/reel|twitter\.com\/.+\/status|x\.com\/.+\/status|\.mp4|video)/i;

  for (const row of rows) {
    // Remove already-created podcast/video landing-page stubs from published
    // articles and unlink the feed row. This cleans up items published before
    // the stricter preflight rule was deployed.
    if (isLowValueTitle(row.title)) {
      if (row.internal_slug) {
        const { error: deleteError } = await supabase
          .from("daily_articles")
          .delete()
          .eq("slug", row.internal_slug);
        if (!deleteError) {
          await supabase
            .from("texas_news_feed")
            .update({ internal_slug: null, ready_for_rewrite: false })
            .eq("id", row.id);
          removedMediaStubs += 1;
        }
      }
      continue;
    }

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

    if (r.viralScore >= VIRAL_READY_MIN_SCORE && hasVideo && r.classificationConfidence >= 0.8) {
      const { data: existing } = await supabase
        .from("reel_candidates")
        .select("id")
        .eq("source_url", row.link || "")
        .maybeSingle();
      if (!existing) {
        await supabase.from("reel_candidates").insert({
          source_platform: "viral-radar",
          source_account: row.source,
          source_url: row.link || "",
          title: row.title,
          topic: r.signals.category,
          notes: `Auto-added from Viral Radar (score ${r.viralScore})`,
          status: "queued",
        });
        reelsQueued += 1;
      }
    }
  }

  return json({
    ok: true,
    ingest,
    scanned: rows.length,
    updated,
    readyFlagged,
    reelsQueued,
    removedMediaStubs,
  });
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}
