import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import {
  scoreFeedItem,
  classifySourceReputation,
  qualifiesReadyForRewrite,
  qualifiesForAutoRewrite,
  VIRAL_READY_MIN_SCORE,
  SOURCE_REPUTATION_FLOOR,
} from "@/lib/viral-score";
import { applyTrustedDiscoveryReviewFloor } from "@/lib/discovery-provenance-reputation";
import { isLowValueTitle } from "@/lib/low-value-titles";
import { publishSingleFeedItem } from "./ingest-feeds";

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

const AUTO_PUBLISH_PER_RUN = 6;
const MAX_AUTO_PUBLISH_ATTEMPTS_PER_RUN = 18;

const POST_REWRITE_REVIEW_RE =
  /\b(election|elections|candidate|candidates|campaign|campaigns|ballot|ballots|voter|voters|voting|primary|runoff|poll|polls|polling|redistrict(?:ing)?|lawsuit|sues?|sued|court|judge|ruling|injunction|indicted|indictment|arrested|charged|charges|suspect|murder|homicide|shooting|killed|dead|death|dies|sexual assault|rape|abuse|fraud claim|unverified|threat(?:en|ened|ening)?|swatting)\b/i;

function requiresPostRewriteReview(article: {
  title?: string | null;
  dek?: string | null;
  body?: string | null;
  category?: string | null;
}): boolean {
  const text = `${article.title ?? ""} ${article.dek ?? ""} ${article.body ?? ""} ${article.category ?? ""}`;
  return POST_REWRITE_REVIEW_RE.test(text);
}

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

    return [{
      title: title.slice(0, 500),
      link,
      pub_date: new Date(Number.isNaN(parsedDate) ? Date.now() : parsedDate).toISOString(),
      source,
      description: description.slice(0, 1000),
    }];
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

  const discovery = await ingestDiscoveryFeeds(supabase);

  const sinceIso = new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("texas_news_feed")
    .select("id,title,source,trend_source,link,pub_date,description,viral_score,viral_signals,internal_slug")
    .gte("pub_date", sinceIso)
    .order("pub_date", { ascending: false })
    .limit(300);

  if (error) return json({ ok: false, error: error.message, ingest, discovery }, 500);
  const rows = (data ?? []) as Array<{
    id: number;
    title: string;
    source: string;
    trend_source: string | null;
    link: string | null;
    pub_date: string;
    description: string | null;
    viral_score: number | null;
    viral_signals: Record<string, unknown> | null;
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
  let autoPublishFlagged = 0;
  let reviewFlagged = 0;
  let reelsQueued = 0;
  let removedMediaStubs = 0;
  let postRewriteReviewBlocked = 0;
  const autoPublishCandidates: Array<{ id: number; score: number; pubDate: string }> = [];

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

    const publisherRep =
      repOverride.get((row.source || "").toLowerCase()) ??
      classifySourceReputation(row.source || "");
    const discoveryRep = row.trend_source
      ? repOverride.get(row.trend_source.toLowerCase()) ?? classifySourceReputation(row.trend_source)
      : null;
    const rep = applyTrustedDiscoveryReviewFloor(
      publisherRep,
      discoveryRep,
      SOURCE_REPUTATION_FLOOR,
    );
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

    const postRewriteReviewRequired = row.viral_signals?.post_rewrite_review_required === true;
    const readyForRewrite = qualifiesReadyForRewrite(result);
    const autoPublish =
      qualifiesForAutoRewrite(result) &&
      result.editorialLane === "AUTO_PUBLISH" &&
      !postRewriteReviewRequired;
    const persistedEditorialLane = postRewriteReviewRequired ? "REVIEW" : result.editorialLane;
    if (readyForRewrite) readyFlagged += 1;
    if (autoPublish) autoPublishFlagged += 1;
    if (persistedEditorialLane === "REVIEW") reviewFlagged += 1;
    if (autoPublish && !row.internal_slug) {
      autoPublishCandidates.push({ id: row.id, score: result.editorialValueScore, pubDate: row.pub_date });
    }

    const { error: updateError } = await supabase
      .from("texas_news_feed")
      .update({
        viral_score: result.viralScore,
        classification_confidence: result.classificationConfidence,
        viral_signals: {
          ...result.signals,
          source_reputation_reason: result.sourceReputationReason,
          discovery_source: row.trend_source,
          has_video: hasVideo,
          editorial_value_score: result.editorialValueScore,
          editorial_lane: persistedEditorialLane,
          editorial_signals: result.editorialSignals,
          auto_publish_eligible: autoPublish,
          post_rewrite_review_required: postRewriteReviewRequired,
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
          notes: `Auto-added from Viral Radar (viral ${result.viralScore}, editorial ${result.editorialValueScore}, lane ${persistedEditorialLane})`,
          status: "queued",
        });
        reelsQueued += 1;
      }
    }
  }

  autoPublishCandidates.sort((a, b) =>
    b.score - a.score || Date.parse(b.pubDate) - Date.parse(a.pubDate),
  );
  const autoPublishResults: Array<{
    id: number;
    ok: boolean;
    slug?: string;
    error?: string;
    alreadyPublished?: boolean;
    reviewRequired?: boolean;
  }> = [];
  let autoPublishSucceeded = 0;
  let autoPublishAttempted = 0;

  for (const candidate of autoPublishCandidates) {
    if (autoPublishSucceeded >= AUTO_PUBLISH_PER_RUN) break;
    if (autoPublishAttempted >= MAX_AUTO_PUBLISH_ATTEMPTS_PER_RUN) break;
    autoPublishAttempted += 1;
    try {
      const result = await publishSingleFeedItem(candidate.id);

      if (result.ok && result.slug && !result.alreadyPublished) {
        const { data: publishedArticle, error: articleReadError } = await supabase
          .from("daily_articles")
          .select("title,dek,body,category")
          .eq("slug", result.slug)
          .maybeSingle();

        if (!articleReadError && publishedArticle && requiresPostRewriteReview(publishedArticle)) {
          const { error: deleteError } = await supabase
            .from("daily_articles")
            .delete()
            .eq("slug", result.slug);

          if (!deleteError) {
            const { data: feedState } = await supabase
              .from("texas_news_feed")
              .select("viral_signals")
              .eq("id", candidate.id)
              .maybeSingle();
            const priorSignals =
              feedState?.viral_signals && typeof feedState.viral_signals === "object"
                ? (feedState.viral_signals as Record<string, unknown>)
                : {};
            await supabase
              .from("texas_news_feed")
              .update({
                internal_slug: null,
                ready_for_rewrite: true,
                viral_signals: {
                  ...priorSignals,
                  editorial_lane: "REVIEW",
                  auto_publish_eligible: false,
                  post_rewrite_review_required: true,
                  post_rewrite_review_reason: "Sensitive topic detected in completed draft",
                },
              })
              .eq("id", candidate.id);
            postRewriteReviewBlocked += 1;
            autoPublishResults.push({
              id: candidate.id,
              ok: false,
              slug: result.slug,
              reviewRequired: true,
              error: "Post-rewrite safety gate moved the completed draft to REVIEW.",
            });
            continue;
          }
        }
      }

      autoPublishResults.push({ id: candidate.id, ...result });
      if (result.ok && result.slug && !result.alreadyPublished) autoPublishSucceeded += 1;
    } catch (error) {
      autoPublishResults.push({
        id: candidate.id,
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return json({
    ok: true,
    ingest,
    discovery,
    scanned: rows.length,
    updated,
    readyFlagged,
    autoPublishFlagged,
    reviewFlagged,
    autoPublishAttempted,
    autoPublished: autoPublishSucceeded,
    postRewriteReviewBlocked,
    autoPublishResults,
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