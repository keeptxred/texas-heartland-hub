import { createFileRoute } from "@tanstack/react-router";

type SourceRow = { source_name: string; rss_url: string; category: string | null };
type FeedRow = {
  id?: number;
  title: string;
  description: string | null;
  source: string;
  trend_source: string | null;
  pub_date: string | null;
  internal_slug: string | null;
  target_site: string | null;
  target_section: string | null;
};
type PublishedRow = { slug: string; title: string; published_at: string | null };
type TexasDefinedReadyRow = {
  id: number;
  title: string;
  description: string | null;
  source: string;
  link: string;
  target_section: string | null;
  pub_date: string | null;
};
type FetchState = {
  source_name: string;
  source_url: string;
  last_checked_at: string;
  last_status: number | null;
  last_item_count: number;
  last_error: string | null;
  last_success_at: string | null;
  consecutive_failures: number;
  consecutive_empty: number;
};
type TransportStatus = "healthy" | "quiet" | "broken" | "stale_check" | "never_checked";
type SourceHealthRow = SourceRow & {
  latest_item_at: string | null;
  items_24h: number;
  items_7d: number;
  covered_7d: number;
  health_status: TransportStatus;
  coverage_rate_7d: number;
  last_checked_at: string | null;
  last_status: number | null;
  last_item_count: number | null;
  last_error: string | null;
};
type FlyoverReconciliationRow = {
  story_key: string;
  expected_site: "keeptxred" | "texasdefined";
  disposition: "review_ready" | "published" | "out_of_scope" | "source_needed" | string;
  feed_id: number | null;
  feed_title: string | null;
  published_slug: string | null;
  evidence_note: string | null;
  last_verified_at: string | null;
};

const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

function normalizeName(value: string) {
  return value.trim().toLowerCase();
}

function normalizeUrl(value: string | null | undefined) {
  return String(value ?? "").trim().replace(/\/$/, "");
}

function classifyFetch(fetch: FetchState | null | undefined, now: number): TransportStatus {
  if (!fetch) return "never_checked";
  const checkedAt = Date.parse(fetch.last_checked_at);
  if (!Number.isFinite(checkedAt) || checkedAt < now - TWO_HOURS_MS) return "stale_check";
  if ((fetch.consecutive_failures ?? 0) >= 2 || !(fetch.last_status != null && fetch.last_status >= 200 && fetch.last_status < 300)) return "broken";
  if ((fetch.last_item_count ?? 0) === 0) return "quiet";
  return "healthy";
}

export const Route = createFileRoute("/api/public/newsroom-health")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const now = Date.now();
        const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
        const publicationGapCutoff = new Date(now - 10 * 60 * 60 * 1000).toISOString();
        const oneDayAgoMs = now - 24 * 60 * 60 * 1000;

        const [gapResult, sourcesResult, fetchStateResult, reconciliationResult, ktrPublishedResult] = await Promise.all([
          supabaseAdmin
            .from("news_coverage_gaps" as never)
            .select("id", { count: "exact", head: true })
            .eq("gap_reason", "article_generation_or_publish_gap")
            .lt("pub_date", publicationGapCutoff),
          supabaseAdmin.from("content_sources" as never).select("source_name,rss_url,category").eq("enabled", true).not("rss_url", "is", null),
          supabaseAdmin
            .from("news_source_fetch_state" as never)
            .select("source_name,source_url,last_checked_at,last_status,last_item_count,last_error,last_success_at,consecutive_failures,consecutive_empty"),
          supabaseAdmin
            .from("flyover_aug10_reconciliation" as never)
            .select("story_key,expected_site,disposition,feed_id,feed_title,published_slug,evidence_note,last_verified_at")
            .order("story_key"),
          supabaseAdmin.from("daily_articles" as never).select("slug,title,published_at").gte("published_at", sevenDaysAgo).order("published_at", { ascending: false }).limit(500),
        ]);

        let feedResult = await supabaseAdmin.from("texas_news_feed" as never)
          .select("id,title,description,source,trend_source,pub_date,internal_slug,target_site,target_section")
          .gte("pub_date", sevenDaysAgo).limit(2000);
        let routingSchemaReady = true;
        if (feedResult.error) {
          routingSchemaReady = false;
          feedResult = await supabaseAdmin.from("texas_news_feed" as never)
            .select("id,title,description,source,trend_source,pub_date,internal_slug")
            .gte("pub_date", sevenDaysAgo).limit(2000) as typeof feedResult;
        }

        const reconciliationRows = (reconciliationResult.data ?? []) as unknown as FlyoverReconciliationRow[];
        const reconciliationFeedIds = reconciliationRows.map((row) => row.feed_id).filter((id): id is number => Number.isFinite(id));
        const reconciliationFeedsResult = reconciliationFeedIds.length > 0
          ? await supabaseAdmin.from("texas_news_feed" as never)
              .select("id,title,description,source,trend_source,pub_date,internal_slug,target_site,target_section")
              .in("id", reconciliationFeedIds)
          : { data: [], error: null };

        const coreErrors = [
          gapResult.error?.message,
          sourcesResult.error?.message,
          fetchStateResult.error?.message,
          reconciliationResult.error?.message,
          reconciliationFeedsResult.error?.message,
          feedResult.error?.message,
          ktrPublishedResult.error?.message,
        ].filter(Boolean);
        if (coreErrors.length > 0) {
          return new Response(JSON.stringify({ ok: false, databaseViewsReady: false, texasDefinedChannelReady: false, errors: coreErrors }), {
            status: 503,
            headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
          });
        }

        let texasDefinedQueueCount = 0;
        let texasDefinedReadyCount = 0;
        let texasDefinedPublishedCount = 0;
        let texasDefinedReadySample: TexasDefinedReadyRow[] = [];
        let texasDefinedPublishedSample: PublishedRow[] = [];
        const optionalErrors: string[] = [];

        const tdQueueResult = await supabaseAdmin.from("texasdefined_story_queue" as never).select("id", { count: "exact", head: true });
        if (tdQueueResult.error) optionalErrors.push(tdQueueResult.error.message); else texasDefinedQueueCount = tdQueueResult.count ?? 0;

        const tdReadyResult = await supabaseAdmin.from("texasdefined_ready_queue" as never)
          .select("id,title,description,source,link,target_section,pub_date", { count: "exact" }).order("pub_date", { ascending: false }).limit(10);
        if (tdReadyResult.error) optionalErrors.push(tdReadyResult.error.message);
        else {
          texasDefinedReadyCount = tdReadyResult.count ?? 0;
          texasDefinedReadySample = (tdReadyResult.data ?? []) as unknown as TexasDefinedReadyRow[];
        }

        const tdArticlesResult = await supabaseAdmin.from("texasdefined_articles" as never)
          .select("slug,title,published_at", { count: "exact" }).eq("status", "published").order("published_at", { ascending: false }).limit(100);
        if (tdArticlesResult.error) optionalErrors.push(tdArticlesResult.error.message);
        else {
          texasDefinedPublishedCount = tdArticlesResult.count ?? 0;
          texasDefinedPublishedSample = (tdArticlesResult.data ?? []) as unknown as PublishedRow[];
        }

        const texasDefinedChannelReady = routingSchemaReady && optionalErrors.length === 0;
        const sourceRows = (sourcesResult.data ?? []) as unknown as SourceRow[];
        const fetchStates = (fetchStateResult.data ?? []) as unknown as FetchState[];
        const feedRows = ((feedResult.data ?? []) as unknown as Array<Partial<FeedRow>>).map((row) => ({
          id: row.id,
          title: String(row.title ?? ""),
          description: row.description ?? null,
          source: String(row.source ?? ""),
          trend_source: row.trend_source ?? null,
          pub_date: row.pub_date ?? null,
          internal_slug: row.internal_slug ?? null,
          target_site: row.target_site ?? null,
          target_section: row.target_section ?? null,
        }));
        const reconciliationFeeds = ((reconciliationFeedsResult.data ?? []) as unknown as Array<Partial<FeedRow>>).map((row) => ({
          id: row.id,
          title: String(row.title ?? ""),
          description: row.description ?? null,
          source: String(row.source ?? ""),
          trend_source: row.trend_source ?? null,
          pub_date: row.pub_date ?? null,
          internal_slug: row.internal_slug ?? null,
          target_site: row.target_site ?? null,
          target_section: row.target_section ?? null,
        }));
        const reconciliationFeedById = new Map(reconciliationFeeds.map((row) => [row.id, row] as const));
        const latestTexasDefined = texasDefinedPublishedSample[0] ?? null;

        const feedBySource = new Map<string, FeedRow[]>();
        for (const row of feedRows) {
          for (const rawKey of [row.trend_source, row.source]) {
            const key = String(rawKey || "").trim().toLowerCase();
            if (!key) continue;
            const list = feedBySource.get(key) ?? [];
            list.push(row);
            feedBySource.set(key, list);
          }
        }
        const fetchByName = new Map(fetchStates.map((row) => [normalizeName(row.source_name), row] as const));
        const fetchByUrl = new Map(fetchStates.map((row) => [normalizeUrl(row.source_url), row] as const).filter(([url]) => Boolean(url)));

        const sources: SourceHealthRow[] = sourceRows.map((source) => {
          const items = feedBySource.get(normalizeName(source.source_name)) ?? [];
          const timestamps = items.map((item) => (item.pub_date ? Date.parse(item.pub_date) : Number.NaN)).filter(Number.isFinite);
          const latestMs = timestamps.length > 0 ? Math.max(...timestamps) : null;
          const items24h = timestamps.filter((timestamp) => timestamp >= oneDayAgoMs).length;
          const covered7d = items.filter((item) => Boolean(item.internal_slug?.trim())).length;
          const fetch = fetchByName.get(normalizeName(source.source_name)) ?? fetchByUrl.get(normalizeUrl(source.rss_url)) ?? null;
          return {
            ...source,
            latest_item_at: latestMs === null ? null : new Date(latestMs).toISOString(),
            items_24h: items24h,
            items_7d: items.length,
            covered_7d: covered7d,
            health_status: classifyFetch(fetch, now),
            coverage_rate_7d: items.length === 0 ? 0 : Math.round((covered7d / items.length) * 1000) / 10,
            last_checked_at: fetch?.last_checked_at ?? null,
            last_status: fetch?.last_status ?? null,
            last_item_count: fetch?.last_item_count ?? null,
            last_error: fetch?.last_error ?? null,
          };
        }).sort((a, b) => a.source_name.localeCompare(b.source_name));

        const statusCounts = sources.reduce<Record<TransportStatus, number>>((acc, row) => {
          acc[row.health_status] = (acc[row.health_status] ?? 0) + 1;
          return acc;
        }, { healthy: 0, quiet: 0, broken: 0, stale_check: 0, never_checked: 0 });

        const flyoverCoverage = reconciliationRows.map((row) => {
          const feed = row.feed_id == null ? null : reconciliationFeedById.get(row.feed_id) ?? null;
          const published = row.disposition === "published";
          const sourceBacked = row.feed_id != null || published;
          const routedCorrectly = published
            ? true
            : feed?.target_site
              ? feed.target_site === row.expected_site
              : row.disposition === "out_of_scope"
                ? true
                : null;
          return {
            key: row.story_key,
            expectedSite: row.expected_site,
            disposition: row.disposition,
            ingested: sourceBacked,
            sourceBacked,
            routedSite: feed?.target_site ?? (published ? row.expected_site : null),
            routedCorrectly,
            feedId: row.feed_id,
            feedTitle: row.feed_title ?? feed?.title ?? null,
            published,
            publishedSlug: row.published_slug,
            publishedTitle: null,
            evidenceNote: row.evidence_note,
            lastVerifiedAt: row.last_verified_at,
          };
        });

        const flyoverDispositionCounts = flyoverCoverage.reduce<Record<string, number>>((acc, row) => {
          acc[row.disposition] = (acc[row.disposition] ?? 0) + 1;
          return acc;
        }, {});

        return new Response(JSON.stringify({
          ok: true,
          databaseViewsReady: true,
          degraded: !texasDefinedChannelReady,
          routingSchemaReady,
          texasDefinedChannelReady,
          schemaErrors: optionalErrors,
          texasDefinedQueueCount,
          texasDefinedReadyCount,
          texasDefinedPublishedCount,
          latestTexasDefinedSlug: latestTexasDefined?.slug ?? null,
          latestTexasDefinedTitle: latestTexasDefined?.title ?? null,
          latestTexasDefinedPublishedAt: latestTexasDefined?.published_at ?? null,
          texasDefinedReadySample,
          texasDefinedPublishedSample,
          flyoverCoverage,
          flyoverDispositionCounts,
          flyoverAccountedForCount: flyoverCoverage.length,
          flyoverIngestedCount: flyoverCoverage.filter((item) => item.ingested).length,
          flyoverRoutedCorrectlyCount: flyoverCoverage.filter((item) => item.routedCorrectly === true).length,
          flyoverPublishedCount: flyoverCoverage.filter((item) => item.published).length,
          flyoverReviewReadyCount: flyoverCoverage.filter((item) => item.disposition === "review_ready").length,
          flyoverOutOfScopeCount: flyoverCoverage.filter((item) => item.disposition === "out_of_scope").length,
          flyoverSourceNeededCount: flyoverCoverage.filter((item) => item.disposition === "source_needed").length,
          coverageGapCount: gapResult.count ?? 0,
          coverageGapSlaHours: 10,
          sourceCount: sources.length,
          sourceStatusCounts: statusCounts,
          items24h: sources.reduce((sum, row) => sum + row.items_24h, 0),
          items7d: sources.reduce((sum, row) => sum + row.items_7d, 0),
          covered7d: sources.reduce((sum, row) => sum + row.covered_7d, 0),
          sources,
          checkedAt: new Date().toISOString(),
        }), { headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
      },
    },
  },
});
