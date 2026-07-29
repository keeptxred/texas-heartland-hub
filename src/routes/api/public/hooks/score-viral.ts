import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import {
  scoreFeedItem,
  classifySourceReputation,
  qualifiesReadyForRewrite,
  VIRAL_READY_MIN_SCORE,
} from "@/lib/viral-score";
import { isLowValueTitle } from "@/lib/low-value-titles";

const DISCOVERY_FEEDS = [
  {
    name: "The Texas Tribune",
    url: "https://feeds.texastribune.org/feeds/main/",
  },
  {
    name: "The Texas Tribune — Politics",
    url: "https://www.texastribune.org/topics/politics/feed",
  },
  {
    name: "The Texas Tribune — Elections",
    url: "https://www.texastribune.org/topics/elections/feed",
  },
  {
    name: "The Texas Tribune — Energy",
    url: "https://www.texastribune.org/topics/energy/feed",
  },
] as const;

function decodeXml(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pickTag(block: string, tag: string): string {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? decodeXml(match[1]) : "";
}

function parseGoogleNewsFeed(xml: string, fallbackSource: string) {
  const blocks = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];
  return blocks.slice(0, 30).flatMap((block) => {
    const rawTitle = pickTag(block, "title");
    const link = pickTag(block, "link");
    const description = pickTag(block, "description");
    const rawDate = pickTag(block, "pubDate");
    if (!rawTitle || !link) return [];

    const titleParts = rawTitle.split(" - ");
    const source = titleParts.length > 1 ? titleParts.pop()!.trim() : fallbackSource;
    const title = titleParts.join(" - ").trim() || rawTitle;
    const parsedDate = Date.parse(rawDate);

    return [
      {
        title: title.slice(0, 500),
        link,
        pub_date: new Date(Number.isNaN(parsedDate) ? Date.now() : parsedDate).toISOString(),
        source,
        description: description.slice(0, 1000),
      },
    ];
  });
}

async function ingestDiscoveryFeeds(
  supabase: any,
): Promise<{ fetched: number; inserted: number; feedsOk: number; errors: string[] }> {
  let fetched = 0;
  let inserted = 0;
  let feedsOk = 0;
  const errors: string[] = [];

  for (const feed of DISCOVERY_FEEDS) {
    try {
      const response = await fetch(feed.url, {
        headers: {
          "User-Agent": "KeepTXRedBot/1.0 (+https://keeptxred.com)",
          Accept: "application/rss+xml,application/xml,text/xml,*/*",
        },
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) {
        errors.push(`${feed.name}: HTTP ${response.status}`);
        continue;
      }

      feedsOk += 1;
      const rows = parseGoogleNewsFeed(await response.text(), feed.name).filter(
        (row) => !isLowValueTitle(row.title),
      );
      fetched += rows.length;
      if (rows.length === 0) continue;

      const { count, error } = await supabase
        .from("texas_news_feed")
        .upsert(rows, { onConflict: "link", ignoreDuplicates: true, count: "exact" });
      if (error) errors.push(`${feed.name}: ${error.message}`);
      else inserted += count ?? 0;
    } catch (error) {
      errors.push(`${feed.name}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return { fetched, inserted, feedsOk, errors };
}

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

  // Import verified direct publisher RSS feeds during every manual newsroom refresh.
  // This does not depend on Supabase migrations or content_sources being populated.
  const discovery = await ingestDiscoveryFeeds(supabase);

  const sinceIso = new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("texas_news_feed")
    .select("id,title,source,link,pub_date,description,viral_score,internal_slug")
    .gte("pub_date", sinceIso)
    .order("pub_date", { ascending: false })
    .limit(300);

  if (error) return json({ ok: false, error: error.message, ingest, discovery }, 500);
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
  const clusterKey = (title: string) =>
    (title ?? "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 3)
      .slice(0, 6)
      .join(" ");
  rows.forEach((row) => {
    if (isLowValueTitle(row.title)) return;
    const cluster = clusterKey(row.title);
    if (!cluster) return;
    clusters.set(cluster, (clusters.get(cluster) ?? 0) + 1);
  });

  const now = new Date().toISOString();
  let updated = 0;
  let readyFlagged = 0;
  let reelsQueued = 0;
  let removedMediaStubs = 0;

  const VIDEO_RE = /(youtube\.com|youtu\.be|tiktok\.com|instagram\.com\/reel|twitter\.com\/.+\/status|x\.com\/.+\/status|\.mp4|video)/i;

  for (const row of rows) {
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
    const result = scoreFeedItem({
      ...row,
      has_video: hasVideo,
      source_reputation_score: rep.score,
      source_reputation_reason: rep.reason,
    });

    const cluster = clusterKey(row.title);
    const sourceCount = cluster ? clusters.get(cluster) ?? 1 : 1;
    const prior = row.viral_score ?? 0;
    const trendVelocity = Number(((result.viralScore - prior) + (sourceCount - 1) * 5).toFixed(2));

    const readyForRewrite = qualifiesReadyForRewrite(result);
    if (readyForRewrite) readyFlagged += 1;

    const { error: updateError } = await supabase
      .from("texas_news_feed")
      .update({
        viral_score: result.viralScore,
        classification_confidence: result.classificationConfidence,
        viral_signals: {
          ...result.signals,
          source_reputation_reason: result.sourceReputationReason,
          has_video: hasVideo,
        },
        texas_relevance_score: result.texasRelevanceScore,
        source_reputation_score: result.sourceReputationScore,
        routing_type: result.routingType,
        trend_velocity: trendVelocity,
        source_count: sourceCount,
        ready_for_rewrite: readyForRewrite,
        viral_scored_at: now,
      })
      .eq("id", row.id);
    if (!updateError) updated += 1;

    if (result.viralScore >= VIRAL_READY_MIN_SCORE && hasVideo && result.classificationConfidence >= 0.8) {
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
          topic: result.signals.category,
          notes: `Auto-added from Viral Radar (score ${result.viralScore})`,
          status: "queued",
        });
        reelsQueued += 1;
      }
    }
  }

  return json({
    ok: true,
    ingest,
    discovery,
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
