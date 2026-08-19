import { createFileRoute } from "@tanstack/react-router";
import { verifyGitHubActionsOidc } from "@/lib/github-actions-oidc";
import { publishSingleFeedItem } from "@/lib/multi-source-publish";
import {
  MAX_RECENT_AUTOMATED_FAILURES,
  rankPublicationCandidates,
  releaseSeriesKey,
} from "@/lib/news-publish-selection";

const OIDC_AUDIENCE = "keeptxred-newsroom";
const REPOSITORY = "keeptxred/texas-heartland-hub";
const WORKFLOW_PATH = ".github/workflows/run-daily-news-now.yml";
const OVERDUE_HOURS = 6;
const MAX_ATTEMPTS = 8;
const MAX_PUBLISHED = 2;
const GAP_SCAN_LIMIT = 80;
const FAILURE_LOOKBACK_HOURS = 24;
const SERIES_LOOKBACK_HOURS = 72;

type GapRow = {
  id: number;
  title: string;
  coverage_priority: number | null;
  source_reputation_score: number | null;
  pub_date: string;
};

type FeedRow = {
  id: number;
  title: string;
  source: string;
  link: string;
  description: string | null;
  pub_date: string;
  target_site: string | null;
  internal_slug: string | null;
  extracted_body?: string | null;
};

type SeriesContext = {
  key: string;
  relatedIds: number[];
  sources: Array<{ label: string; url: string }>;
};

function bearerToken(request: Request): string | null {
  const value = request.headers.get("authorization") ?? "";
  const match = value.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

function titleKey(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

async function recentFailureCounts(db: any, ids: number[]): Promise<Map<number, number>> {
  const counts = new Map<number, number>();
  if (!ids.length) return counts;
  const cutoff = new Date(Date.now() - FAILURE_LOOKBACK_HOURS * 60 * 60 * 1000).toISOString();
  const { data, error } = await db
    .from("ai_rewrite_failures")
    .select("feed_item_id,failed_at")
    .in("feed_item_id", ids)
    .gte("failed_at", cutoff);
  if (error) {
    console.warn("[overdue-gap] failure history unavailable; continuing without retry counts", error.message);
    return counts;
  }
  for (const row of data ?? []) {
    const id = Number(row.feed_item_id);
    if (!Number.isFinite(id)) continue;
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return counts;
}

async function prepareReleaseSeriesContext(db: any, selected: FeedRow): Promise<SeriesContext | null> {
  const key = releaseSeriesKey(selected.title);
  if (!key) return null;

  const cutoff = new Date(Date.now() - SERIES_LOOKBACK_HOURS * 60 * 60 * 1000).toISOString();
  const { data, error } = await db
    .from("texas_news_feed")
    .select("id,title,source,link,description,pub_date,internal_slug,extracted_body,target_site")
    .eq("target_site", "keeptxred")
    .is("internal_slug", null)
    .gte("pub_date", cutoff)
    .ilike("title", "%Data Center Standards%")
    .order("pub_date", { ascending: false })
    .limit(16);
  if (error) {
    console.warn("[overdue-gap] related release series lookup failed", error.message);
    return null;
  }

  const related = ((data ?? []) as FeedRow[])
    .filter((row) => releaseSeriesKey(row.title) === key)
    .slice(0, 10);
  if (related.length < 2) return null;

  const evidence = related.map((row, index) => {
    const sourceText = (row.extracted_body || row.description || "").trim().slice(0, 3500);
    return [
      `OFFICIAL RELEASE ${index + 1}`,
      `DATE: ${row.pub_date}`,
      `SOURCE: ${row.source}`,
      `HEADLINE: ${row.title}`,
      `URL: ${row.link}`,
      `SOURCE MATERIAL: ${sourceText}`,
    ].join("\n");
  }).join("\n\n--- RELATED RELEASE ---\n\n");

  const combined = [
    "RELATED OFFICIAL RELEASE SERIES: These records are multiple announcements in the same Texas data-center standards rollout. Cover the rollout as one developing policy story rather than separate company-by-company articles. Do not treat same-publisher releases as independent corroboration.",
    evidence,
  ].join("\n\n").slice(0, 24000);

  const { error: updateError } = await db
    .from("texas_news_feed")
    .update({ extracted_body: combined })
    .eq("id", selected.id);
  if (updateError) {
    console.warn("[overdue-gap] release series evidence was not persisted", updateError.message);
    return null;
  }

  return {
    key,
    relatedIds: related.map((row) => row.id),
    sources: related.map((row) => ({ label: `${row.source} — related official release`, url: row.link })),
  };
}

async function attachSeriesToPublishedArticle(
  db: any,
  slug: string,
  series: SeriesContext,
): Promise<void> {
  const { data: article, error } = await db
    .from("daily_articles")
    .select("body_json")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !article?.body_json || typeof article.body_json !== "object") {
    console.warn("[overdue-gap] could not attach related release sources", error?.message ?? "article body missing");
    return;
  }

  const body = article.body_json as Record<string, unknown>;
  const existing = Array.isArray(body.sources)
    ? body.sources as Array<{ label?: string; url?: string }>
    : [];
  const byUrl = new Map<string, { label?: string; url?: string }>();
  for (const source of [...existing, ...series.sources]) {
    if (source.url) byUrl.set(source.url, source);
  }

  const { error: articleUpdateError } = await db
    .from("daily_articles")
    .update({
      body_json: { ...body, sources: [...byUrl.values()] },
      source_name: "Office of the Governor — related release series",
    })
    .eq("slug", slug);
  if (articleUpdateError) {
    console.warn("[overdue-gap] series source attribution update failed", articleUpdateError.message);
  }

  const { error: linkError } = await db
    .from("texas_news_feed")
    .update({ internal_slug: slug })
    .in("id", series.relatedIds)
    .is("internal_slug", null);
  if (linkError) {
    console.warn("[overdue-gap] series sibling link update failed", linkError.message);
  }
}

async function publishOverdueGaps(request: Request) {
  const token = bearerToken(request);
  if (!token) {
    return Response.json({ ok: false, error: "Missing GitHub Actions OIDC token" }, { status: 401 });
  }

  try {
    await verifyGitHubActionsOidc({
      token,
      audience: OIDC_AUDIENCE,
      repository: REPOSITORY,
      workflowPath: WORKFLOW_PATH,
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: "GitHub Actions OIDC verification failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 403 },
    );
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const db = supabaseAdmin as any;
  const cutoff = new Date(Date.now() - OVERDUE_HOURS * 60 * 60 * 1000).toISOString();

  const { data: rawGaps, error: gapError } = await db
    .from("news_coverage_gaps")
    .select("id,title,coverage_priority,source_reputation_score,pub_date")
    .eq("gap_reason", "article_generation_or_publish_gap")
    .lt("pub_date", cutoff)
    .order("pub_date", { ascending: false })
    .limit(GAP_SCAN_LIMIT);

  if (gapError) {
    return Response.json({ ok: false, error: gapError.message }, { status: 500 });
  }

  const gaps = (rawGaps ?? []) as GapRow[];
  if (gaps.length === 0) {
    return Response.json({ ok: true, no_items: true, attempted: 0, published: 0, results: [] });
  }

  const ids = gaps.map((gap) => gap.id);
  const [{ data: rawFeedRows, error: feedError }, failureCounts] = await Promise.all([
    db
      .from("texas_news_feed")
      .select("id,title,source,link,description,pub_date,target_site,internal_slug,extracted_body")
      .in("id", ids),
    recentFailureCounts(db, ids),
  ]);

  if (feedError) {
    return Response.json({ ok: false, error: feedError.message }, { status: 500 });
  }

  const feedById = new Map<number, FeedRow>(
    ((rawFeedRows ?? []) as FeedRow[]).map((row) => [row.id, row]),
  );
  const seenTitles = new Set<string>();
  const eligibleGaps = gaps.filter((gap) => {
    const feed = feedById.get(gap.id);
    if (!feed || feed.internal_slug) return false;
    if (feed.target_site !== "keeptxred") return false;
    const key = titleKey(feed.title || gap.title);
    if (!key || seenTitles.has(key)) return false;
    seenTitles.add(key);
    return true;
  });

  const ranked = rankPublicationCandidates(eligibleGaps, failureCounts);
  const skippedForRecentFailures = eligibleGaps.filter(
    (gap) => (failureCounts.get(gap.id) ?? 0) >= MAX_RECENT_AUTOMATED_FAILURES,
  ).length;

  const results: Array<{
    feed_item_id: number;
    title: string;
    ok: boolean;
    slug?: string;
    alreadyPublished?: boolean;
    series?: string;
    error?: string;
  }> = [];
  let published = 0;

  for (const gap of ranked.slice(0, MAX_ATTEMPTS)) {
    const feed = feedById.get(gap.id);
    if (!feed) continue;
    const series = await prepareReleaseSeriesContext(db, feed);
    const result = await publishSingleFeedItem(gap.id);
    results.push({
      feed_item_id: gap.id,
      title: gap.title,
      ok: result.ok,
      slug: result.slug,
      alreadyPublished: result.alreadyPublished,
      series: series?.key,
      error: result.error,
    });

    if (result.ok && result.slug) {
      published += result.alreadyPublished ? 0 : 1;

      if (series) {
        await attachSeriesToPublishedArticle(db, result.slug, series);
      } else {
        // Exact-title duplicates are the same syndicated headline in our feed
        // (for example direct Texas Tribune plus Google News). Link all recent
        // unlinked copies to the one canonical KTR article instead of allowing
        // the health contract to treat them as separate missing publications.
        const recentCutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        await db
          .from("texas_news_feed")
          .update({ internal_slug: result.slug })
          .eq("title", gap.title)
          .is("internal_slug", null)
          .eq("target_site", "keeptxred")
          .gte("pub_date", recentCutoff);
      }
    }

    if (published >= MAX_PUBLISHED) break;
  }

  return Response.json({
    ok: true,
    no_items: ranked.length === 0,
    overdue_count: gaps.length,
    eligible_before_ranking: eligibleGaps.length,
    candidate_count: ranked.length,
    skipped_recent_failures: skippedForRecentFailures,
    recent_failure_limit: MAX_RECENT_AUTOMATED_FAILURES,
    attempted: results.length,
    published,
    results,
  });
}

export const Route = createFileRoute("/api/public/hooks/publish-overdue-gap")({
  server: {
    handlers: {
      POST: async ({ request }) => publishOverdueGaps(request),
    },
  },
});
