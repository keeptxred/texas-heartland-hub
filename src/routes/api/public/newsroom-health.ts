import { createFileRoute } from "@tanstack/react-router";

type SourceRow = { source_name: string; rss_url: string; category: string | null };
type FeedRow = {
  title: string;
  description: string | null;
  source: string;
  trend_source: string | null;
  pub_date: string | null;
  internal_slug: string | null;
  target_site: string | null;
  target_section: string | null;
  viral_signals?: Record<string, unknown> | null;
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
type SourceActivityRow = SourceRow & {
  latest_item_at: string | null;
  items_24h: number;
  items_7d: number;
  covered_7d: number;
  health_status: "healthy" | "quiet" | "stale" | "never_seen";
  coverage_rate_7d: number;
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

type FlyoverSpec = { key: string; expectedSite: "keeptxred" | "texasdefined"; terms: RegExp[] };
const flyoverSpecs: FlyoverSpec[] = [
  { key: "state-fair-gun-ban", expectedSite: "keeptxred", terms: [/state fair/i, /(gun|handgun|firearm)/i] },
  { key: "fort-worth-alligators-shot", expectedSite: "keeptxred", terms: [/(fort worth|nature center)/i, /alligator/i, /(shot|crossbow|killed)/i] },
  { key: "don-nelson", expectedSite: "keeptxred", terms: [/don nelson/i, /(mavericks|dallas|nba|coach)/i] },
  { key: "ingram-school-flood-repairs", expectedSite: "keeptxred", terms: [/ingram/i, /(school|campus|isd)/i, /(flood|storm|repair)/i] },
  { key: "st-louis-encephalitis", expectedSite: "keeptxred", terms: [/(st\. louis encephalitis|encephalitis)/i, /(corpus christi|kingsville|mosquito)/i] },
  { key: "lakeside-fentanyl-children", expectedSite: "keeptxred", terms: [/fentanyl/i, /(lakeside|children|child endangerment|four children)/i] },
  { key: "dallas-pedestrian-waymo", expectedSite: "keeptxred", terms: [/dallas/i, /(waymo|pedestrian|maple avenue)/i] },
  { key: "canyon-lake-full", expectedSite: "texasdefined", terms: [/canyon lake/i, /(full|capacity|reservoir)/i] },
  { key: "bastrop-council-retreat", expectedSite: "keeptxred", terms: [/bastrop/i, /(council|fredericksburg|gerdes|offsite)/i] },
  { key: "kaylee-hottle-scholarship", expectedSite: "texasdefined", terms: [/(kaylee hottle|school for the deaf)/i, /scholarship/i] },
  { key: "tate-taylor-sprint-double", expectedSite: "keeptxred", terms: [/tate taylor/i, /(200 meters|sprint|under-20|u20|texas tech|world athletics)/i] },
  { key: "texas-stadium-mavericks-redevelopment", expectedSite: "keeptxred", terms: [/(texas stadium|irving)/i, /(mavericks|redevelop)/i] },
  { key: "cowboys-quinnen-williams", expectedSite: "keeptxred", terms: [/quinnen williams/i, /cowboys/i] },
  { key: "rangers-jonah-bride", expectedSite: "keeptxred", terms: [/jonah bride/i, /(rangers|round rock|osuna|leiter)/i] },
  { key: "heb-store-upgrades", expectedSite: "keeptxred", terms: [/(h-e-b|heb)/i, /(upgrade|remodel|5\.2 million)/i] },
  { key: "caseys-pak-a-sak", expectedSite: "keeptxred", terms: [/(casey|casey's)/i, /pak-a-sak/i] },
  { key: "sushi-door-dash-dispute", expectedSite: "keeptxred", terms: [/(sushi by the heights|sushi)/i, /(doordash|door dash)/i] },
  { key: "texas-born-county-ranking", expectedSite: "texasdefined", terms: [/(born in texas|texas-born|born in the state)/i, /(jim hogg|county|counties)/i] },
  { key: "eds-plano-implosion", expectedSite: "texasdefined", terms: [/(eds|electronic data systems)/i, /(plano|implosion|imploded|at&t)/i] },
  { key: "richardson-lego-public-safety", expectedSite: "texasdefined", terms: [/richardson/i, /lego/i, /(public safety|police|fire)/i] },
  { key: "kris6-anchor-layoffs", expectedSite: "keeptxred", terms: [/(kris 6|hofmann)/i, /(layoff|sign off|scripps|goodbye)/i] },
  { key: "3d-printed-wheelchair", expectedSite: "texasdefined", terms: [/(3d-printed|3d printed)/i, /wheelchair/i] },
  { key: "nueces-1862-history", expectedSite: "texasdefined", terms: [/(nueces|kinney county|german unionists)/i, /(1862|unionist|german)/i] },
];

const FLYOVER_HISTORY_START = "2026-07-15T00:00:00.000Z";
const FLYOVER_HISTORY_END = "2026-08-12T23:59:59.999Z";
const FLYOVER_PUBLICATION_START = "2026-08-01T00:00:00.000Z";
const FLYOVER_PUBLICATION_END = "2026-08-15T23:59:59.999Z";
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

function matchesSpec(text: string, spec: FlyoverSpec) {
  return spec.terms.every((term) => term.test(text));
}

function normalizeName(value: string) {
  return value.trim().toLowerCase();
}

function normalizeUrl(value: string | null | undefined) {
  return String(value ?? "").trim().replace(/\/$/, "");
}

function classifyTransport(fetch: FetchState | null | undefined, now: number): TransportStatus {
  if (!fetch) return "never_checked";
  const checkedAt = Date.parse(fetch.last_checked_at);
  if (!Number.isFinite(checkedAt) || checkedAt < now - TWO_HOURS_MS) return "stale_check";
  if ((fetch.consecutive_failures ?? 0) >= 2 || !(fetch.last_status != null && fetch.last_status >= 200 && fetch.last_status < 300)) return "broken";
  if ((fetch.last_item_count ?? 0) === 0) return "quiet";
  return "healthy";
}

function blankTransportCounts(): Record<TransportStatus, number> {
  return { healthy: 0, quiet: 0, broken: 0, stale_check: 0, never_checked: 0 };
}

function normalizeFeedRows(data: unknown): FeedRow[] {
  return ((data ?? []) as Array<Partial<FeedRow>>).map((row) => ({
    title: String(row.title ?? ""),
    description: row.description ?? null,
    source: String(row.source ?? ""),
    trend_source: row.trend_source ?? null,
    pub_date: row.pub_date ?? null,
    internal_slug: row.internal_slug ?? null,
    target_site: row.target_site ?? null,
    target_section: row.target_section ?? null,
    viral_signals: row.viral_signals ?? null,
  }));
}

function dedupeFlyoverRows(rows: FeedRow[]): FeedRow[] {
  const seen = new Set<string>();
  return rows.filter((row) => {
    const key = `${row.title.trim().toLowerCase()}|${row.source.trim().toLowerCase()}|${row.pub_date ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
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
        const twoDaysAgoMs = now - 48 * 60 * 60 * 1000;
        const sevenDaysAgoMs = now - 7 * 24 * 60 * 60 * 1000;

        const [gapResult, sourcesResult, ktrPublishedResult, fetchStateResult] = await Promise.all([
          supabaseAdmin
            .from("news_coverage_gaps" as never)
            .select("id", { count: "exact", head: true })
            .eq("gap_reason", "article_generation_or_publish_gap")
            .lt("pub_date", publicationGapCutoff),
          supabaseAdmin.from("content_sources" as never).select("source_name,rss_url,category").eq("enabled", true).not("rss_url", "is", null),
          supabaseAdmin.from("daily_articles" as never).select("slug,title,published_at").gte("published_at", sevenDaysAgo).order("published_at", { ascending: false }).limit(500),
          supabaseAdmin.from("news_source_fetch_state" as never).select("source_name,source_url,last_checked_at,last_status,last_item_count,last_error,last_success_at,consecutive_failures,consecutive_empty"),
        ]);

        let feedResult = await supabaseAdmin.from("texas_news_feed" as never)
          .select("title,description,source,trend_source,pub_date,internal_slug,target_site,target_section")
          .gte("pub_date", sevenDaysAgo).limit(1500);
        let routingSchemaReady = true;
        if (feedResult.error) {
          routingSchemaReady = false;
          feedResult = await supabaseAdmin.from("texas_news_feed" as never)
            .select("title,description,source,trend_source,pub_date,internal_slug")
            .gte("pub_date", sevenDaysAgo).limit(1500) as typeof feedResult;
        }

        const coreErrors = [gapResult.error?.message, sourcesResult.error?.message, feedResult.error?.message, ktrPublishedResult.error?.message, fetchStateResult.error?.message].filter(Boolean);
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
        let flyoverRecoveryRows: FeedRow[] = [];
        let flyoverHistoricalRows: FeedRow[] = [];
        let flyoverKtrPublishedRows: PublishedRow[] = [];
        const optionalErrors: string[] = [];

        const [tdQueueResult, tdReadyResult, tdArticlesResult, flyoverRecoveryResult, flyoverHistoricalResult, flyoverKtrPublishedResult] = await Promise.all([
          supabaseAdmin.from("texasdefined_story_queue" as never).select("id", { count: "exact", head: true }),
          supabaseAdmin.from("texasdefined_ready_queue" as never)
            .select("id,title,description,source,link,target_section,pub_date", { count: "exact" }).order("pub_date", { ascending: false }).limit(10),
          supabaseAdmin.from("texasdefined_articles" as never)
            .select("slug,title,published_at", { count: "exact" }).eq("status", "published").order("published_at", { ascending: false }).limit(200),
          supabaseAdmin.from("texas_news_feed" as never)
            .select("title,description,source,trend_source,pub_date,internal_slug,target_site,target_section,viral_signals")
            .contains("viral_signals", { flyover_aug10_reconciliation: true }).limit(500),
          supabaseAdmin.from("texas_news_feed" as never)
            .select("title,description,source,trend_source,pub_date,internal_slug,target_site,target_section,viral_signals")
            .gte("pub_date", FLYOVER_HISTORY_START).lte("pub_date", FLYOVER_HISTORY_END).limit(5000),
          supabaseAdmin.from("daily_articles" as never)
            .select("slug,title,published_at")
            .gte("published_at", FLYOVER_PUBLICATION_START).lte("published_at", FLYOVER_PUBLICATION_END)
            .order("published_at", { ascending: false }).limit(2500),
        ]);

        if (tdQueueResult.error) optionalErrors.push(tdQueueResult.error.message); else texasDefinedQueueCount = tdQueueResult.count ?? 0;
        if (tdReadyResult.error) optionalErrors.push(tdReadyResult.error.message);
        else {
          texasDefinedReadyCount = tdReadyResult.count ?? 0;
          texasDefinedReadySample = (tdReadyResult.data ?? []) as unknown as TexasDefinedReadyRow[];
        }
        if (tdArticlesResult.error) optionalErrors.push(tdArticlesResult.error.message);
        else {
          texasDefinedPublishedCount = tdArticlesResult.count ?? 0;
          texasDefinedPublishedSample = (tdArticlesResult.data ?? []) as unknown as PublishedRow[];
        }
        if (flyoverRecoveryResult.error) optionalErrors.push(`flyover recovery: ${flyoverRecoveryResult.error.message}`);
        else flyoverRecoveryRows = normalizeFeedRows(flyoverRecoveryResult.data);
        if (flyoverHistoricalResult.error) optionalErrors.push(`flyover history: ${flyoverHistoricalResult.error.message}`);
        else flyoverHistoricalRows = normalizeFeedRows(flyoverHistoricalResult.data);
        if (flyoverKtrPublishedResult.error) optionalErrors.push(`flyover KTR publications: ${flyoverKtrPublishedResult.error.message}`);
        else flyoverKtrPublishedRows = (flyoverKtrPublishedResult.data ?? []) as unknown as PublishedRow[];

        const texasDefinedChannelReady = routingSchemaReady && optionalErrors.filter((error) => !error.startsWith("flyover ")).length === 0;
        const flyoverAuditReady = !optionalErrors.some((error) => error.startsWith("flyover "));
        const sourceRows = (sourcesResult.data ?? []) as unknown as SourceRow[];
        const feedRows = normalizeFeedRows(feedResult.data);
        const ktrPublishedRows = (ktrPublishedResult.data ?? []) as unknown as PublishedRow[];
        const fetchStates = (fetchStateResult.data ?? []) as unknown as FetchState[];
        const latestTexasDefined = texasDefinedPublishedSample[0] ?? null;

        const feedBySource = new Map<string, FeedRow[]>();
        for (const row of feedRows) {
          const key = String(row.trend_source || row.source || "").trim().toLowerCase();
          if (!key) continue;
          const list = feedBySource.get(key) ?? [];
          list.push(row);
          feedBySource.set(key, list);
        }

        const sourceActivity: SourceActivityRow[] = sourceRows.map((source) => {
          const items = feedBySource.get(source.source_name.trim().toLowerCase()) ?? [];
          const timestamps = items.map((item) => (item.pub_date ? Date.parse(item.pub_date) : Number.NaN)).filter(Number.isFinite);
          const latestMs = timestamps.length > 0 ? Math.max(...timestamps) : null;
          const items24h = timestamps.filter((timestamp) => timestamp >= oneDayAgoMs).length;
          const covered7d = items.filter((item) => Boolean(item.internal_slug?.trim())).length;
          const healthStatus: SourceActivityRow["health_status"] = latestMs === null ? "never_seen" : latestMs < sevenDaysAgoMs ? "stale" : latestMs < twoDaysAgoMs ? "quiet" : "healthy";
          return { ...source, latest_item_at: latestMs === null ? null : new Date(latestMs).toISOString(), items_24h: items24h, items_7d: items.length, covered_7d: covered7d, health_status: healthStatus, coverage_rate_7d: items.length === 0 ? 0 : Math.round((covered7d / items.length) * 1000) / 10 };
        }).sort((a, b) => a.source_name.localeCompare(b.source_name));

        const feedActivityStatusCounts = sourceActivity.reduce<Record<string, number>>((acc, row) => {
          acc[row.health_status] = (acc[row.health_status] ?? 0) + 1;
          return acc;
        }, {});

        const fetchByName = new Map(fetchStates.map((row) => [normalizeName(row.source_name), row] as const));
        const fetchByUrl = new Map(fetchStates.map((row) => [normalizeUrl(row.source_url), row] as const).filter(([url]) => Boolean(url)));
        const transportRows = sourceRows.map((source) => {
          const byName = fetchByName.get(normalizeName(source.source_name)) ?? null;
          const byUrl = fetchByUrl.get(normalizeUrl(source.rss_url)) ?? null;
          const fetch = byName ?? byUrl;
          return {
            sourceName: source.source_name,
            sourceUrl: source.rss_url,
            category: source.category,
            status: classifyTransport(fetch, now),
            lastCheckedAt: fetch?.last_checked_at ?? null,
            lastStatus: fetch?.last_status ?? null,
            lastItemCount: fetch?.last_item_count ?? null,
            lastError: fetch?.last_error ?? null,
            consecutiveFailures: fetch?.consecutive_failures ?? 0,
          };
        });
        const transportStatusCounts = transportRows.reduce<Record<TransportStatus, number>>((acc, row) => {
          acc[row.status] += 1;
          return acc;
        }, blankTransportCounts());

        const flyoverRows = dedupeFlyoverRows([...flyoverRecoveryRows, ...flyoverHistoricalRows]);
        const flyoverCoverage = flyoverSpecs.map((spec) => {
          const feedMatch = flyoverRows.find((row) => matchesSpec(`${row.title} ${row.description ?? ""}`, spec));
          const publicationRows = spec.expectedSite === "keeptxred" ? flyoverKtrPublishedRows : texasDefinedPublishedSample;
          const publishedMatch = publicationRows.find((row) => matchesSpec(row.title, spec));
          return {
            key: spec.key,
            expectedSite: spec.expectedSite,
            ingested: Boolean(feedMatch),
            routedSite: feedMatch?.target_site ?? null,
            routedSection: feedMatch?.target_section ?? null,
            routedCorrectly: routingSchemaReady ? Boolean(feedMatch && feedMatch.target_site === spec.expectedSite) : null,
            feedTitle: feedMatch?.title ?? null,
            published: Boolean(publishedMatch),
            publishedSlug: publishedMatch?.slug ?? null,
            publishedTitle: publishedMatch?.title ?? null,
          };
        });

        return new Response(JSON.stringify({
          ok: true,
          databaseViewsReady: true,
          degraded: !texasDefinedChannelReady || !flyoverAuditReady,
          routingSchemaReady,
          texasDefinedChannelReady,
          flyoverAuditReady,
          schemaErrors: optionalErrors,
          texasDefinedQueueCount,
          texasDefinedReadyCount,
          texasDefinedPublishedCount,
          latestTexasDefinedSlug: latestTexasDefined?.slug ?? null,
          latestTexasDefinedTitle: latestTexasDefined?.title ?? null,
          latestTexasDefinedPublishedAt: latestTexasDefined?.published_at ?? null,
          texasDefinedReadySample,
          texasDefinedPublishedSample,
          flyoverAuditWindow: {
            feedStart: FLYOVER_HISTORY_START,
            feedEnd: FLYOVER_HISTORY_END,
            ktrPublicationStart: FLYOVER_PUBLICATION_START,
            ktrPublicationEnd: FLYOVER_PUBLICATION_END,
          },
          flyoverRecoveryRowCount: flyoverRecoveryRows.length,
          flyoverHistoricalRowCount: flyoverHistoricalRows.length,
          flyoverCoverage,
          flyoverIngestedCount: flyoverCoverage.filter((item) => item.ingested).length,
          flyoverRoutedCorrectlyCount: flyoverCoverage.filter((item) => item.routedCorrectly === true).length,
          flyoverPublishedCount: flyoverCoverage.filter((item) => item.published).length,
          coverageGapCount: gapResult.count ?? 0,
          coverageGapSlaHours: 10,
          sourceCount: sourceRows.length,
          sourceStatusCounts: transportStatusCounts,
          transportSourceStatusCounts: transportStatusCounts,
          feedActivityStatusCounts,
          transportBrokenSourceCount: transportStatusCounts.broken,
          transportNeverCheckedSourceCount: transportStatusCounts.never_checked,
          items24h: sourceActivity.reduce((sum, row) => sum + row.items_24h, 0),
          items7d: sourceActivity.reduce((sum, row) => sum + row.items_7d, 0),
          covered7d: sourceActivity.reduce((sum, row) => sum + row.covered_7d, 0),
          sources: sourceActivity,
          transportSources: transportRows,
          recentKtrPublishedCount: ktrPublishedRows.length,
          checkedAt: new Date().toISOString(),
        }), { headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
      },
    },
  },
});
