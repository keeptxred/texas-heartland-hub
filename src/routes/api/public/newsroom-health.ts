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
type SourceHealthRow = SourceRow & {
  latest_item_at: string | null;
  items_24h: number;
  items_7d: number;
  covered_7d: number;
  health_status: "healthy" | "quiet" | "stale" | "never_seen";
  coverage_rate_7d: number;
};

type FlyoverSpec = { key: string; expectedSite: "keeptxred" | "texasdefined"; terms: RegExp[] };
const flyoverSpecs: FlyoverSpec[] = [
  { key: "state-fair-gun-ban", expectedSite: "keeptxred", terms: [/state fair/i, /(gun|handgun|firearm)/i] },
  { key: "fort-worth-alligators-shot", expectedSite: "keeptxred", terms: [/(fort worth|nature center)/i, /alligator/i, /(shot|crossbow|killed)/i] },
  { key: "don-nelson", expectedSite: "keeptxred", terms: [/don nelson/i, /(mavericks|dallas)/i] },
  { key: "ingram-school-flood-repairs", expectedSite: "keeptxred", terms: [/ingram/i, /(school|campus)/i, /(flood|storm|repair)/i] },
  { key: "st-louis-encephalitis", expectedSite: "keeptxred", terms: [/(st\. louis encephalitis|encephalitis)/i, /(corpus christi|kingsville|mosquito)/i] },
  { key: "lakeside-fentanyl-children", expectedSite: "keeptxred", terms: [/fentanyl/i, /(lakeside|children|child endangerment)/i] },
  { key: "dallas-pedestrian-waymo", expectedSite: "keeptxred", terms: [/dallas/i, /(waymo|pedestrian|maple avenue)/i] },
  { key: "canyon-lake-full", expectedSite: "texasdefined", terms: [/canyon lake/i, /(full|capacity|reservoir)/i] },
  { key: "bastrop-council-retreat", expectedSite: "keeptxred", terms: [/bastrop/i, /(council|fredericksburg|gerdes)/i] },
  { key: "kaylee-hottle-scholarship", expectedSite: "texasdefined", terms: [/(kaylee hottle|school for the deaf)/i, /scholarship/i] },
  { key: "tate-taylor-sprint-double", expectedSite: "keeptxred", terms: [/tate taylor/i, /(200 meters|sprint|under-20|texas tech)/i] },
  { key: "texas-stadium-mavericks-redevelopment", expectedSite: "keeptxred", terms: [/(texas stadium|irving)/i, /(mavericks|redevelop)/i] },
  { key: "cowboys-quinnen-williams", expectedSite: "keeptxred", terms: [/quinnen williams/i, /cowboys/i] },
  { key: "rangers-jonah-bride", expectedSite: "keeptxred", terms: [/jonah bride/i, /(rangers|round rock|osuna|leiter)/i] },
  { key: "heb-store-upgrades", expectedSite: "keeptxred", terms: [/(h-e-b|heb)/i, /(upgrade|remodel|5\.2 million)/i] },
  { key: "caseys-pak-a-sak", expectedSite: "keeptxred", terms: [/(casey|casey's)/i, /pak-a-sak/i] },
  { key: "sushi-door-dash-dispute", expectedSite: "keeptxred", terms: [/(sushi by the heights|sushi)/i, /(doordash|door dash)/i] },
  { key: "texas-born-county-ranking", expectedSite: "texasdefined", terms: [/(born in texas|texas-born)/i, /(jim hogg|county|counties)/i] },
  { key: "eds-plano-implosion", expectedSite: "texasdefined", terms: [/(eds|electronic data systems)/i, /(plano|implosion|at&t)/i] },
  { key: "richardson-lego-public-safety", expectedSite: "texasdefined", terms: [/richardson/i, /lego/i, /(public safety|police)/i] },
  { key: "kris6-anchor-layoffs", expectedSite: "keeptxred", terms: [/(kris 6|hofmann)/i, /(layoff|sign off|scripps)/i] },
  { key: "3d-printed-wheelchair", expectedSite: "texasdefined", terms: [/(3d-printed|3d printed)/i, /wheelchair/i] },
  { key: "nueces-1862-history", expectedSite: "texasdefined", terms: [/(nueces|kinney county)/i, /(1862|unionist|german)/i] },
];

function matchesSpec(text: string, spec: FlyoverSpec) {
  return spec.terms.every((term) => term.test(text));
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

        const [gapResult, sourcesResult, ktrPublishedResult] = await Promise.all([
          supabaseAdmin
            .from("news_coverage_gaps" as never)
            .select("id", { count: "exact", head: true })
            .eq("gap_reason", "article_generation_or_publish_gap")
            .lt("pub_date", publicationGapCutoff),
          supabaseAdmin.from("content_sources" as never).select("source_name,rss_url,category").eq("enabled", true).not("rss_url", "is", null),
          supabaseAdmin.from("daily_articles" as never).select("slug,title,published_at").gte("published_at", sevenDaysAgo).order("published_at", { ascending: false }).limit(500),
        ]);

        let feedResult = await supabaseAdmin.from("texas_news_feed" as never)
          .select("title,description,source,trend_source,pub_date,internal_slug,target_site,target_section")
          .gte("pub_date", sevenDaysAgo).limit(1000);
        let routingSchemaReady = true;
        if (feedResult.error) {
          routingSchemaReady = false;
          feedResult = await supabaseAdmin.from("texas_news_feed" as never)
            .select("title,description,source,trend_source,pub_date,internal_slug")
            .gte("pub_date", sevenDaysAgo).limit(1000) as typeof feedResult;
        }

        const coreErrors = [gapResult.error?.message, sourcesResult.error?.message, feedResult.error?.message, ktrPublishedResult.error?.message].filter(Boolean);
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
        const feedRows = ((feedResult.data ?? []) as unknown as Array<Partial<FeedRow>>).map((row) => ({
          title: String(row.title ?? ""),
          description: row.description ?? null,
          source: String(row.source ?? ""),
          trend_source: row.trend_source ?? null,
          pub_date: row.pub_date ?? null,
          internal_slug: row.internal_slug ?? null,
          target_site: row.target_site ?? null,
          target_section: row.target_section ?? null,
        }));
        const ktrPublishedRows = (ktrPublishedResult.data ?? []) as unknown as PublishedRow[];
        const latestTexasDefined = texasDefinedPublishedSample[0] ?? null;
        const feedBySource = new Map<string, FeedRow[]>();
        for (const row of feedRows) {
          const key = String(row.trend_source || row.source || "").trim().toLowerCase();
          if (!key) continue;
          const list = feedBySource.get(key) ?? [];
          list.push(row);
          feedBySource.set(key, list);
        }

        const sources: SourceHealthRow[] = sourceRows.map((source) => {
          const items = feedBySource.get(source.source_name.trim().toLowerCase()) ?? [];
          const timestamps = items.map((item) => (item.pub_date ? Date.parse(item.pub_date) : Number.NaN)).filter(Number.isFinite);
          const latestMs = timestamps.length > 0 ? Math.max(...timestamps) : null;
          const items24h = timestamps.filter((timestamp) => timestamp >= oneDayAgoMs).length;
          const covered7d = items.filter((item) => Boolean(item.internal_slug?.trim())).length;
          const healthStatus: SourceHealthRow["health_status"] = latestMs === null ? "never_seen" : latestMs < sevenDaysAgoMs ? "stale" : latestMs < twoDaysAgoMs ? "quiet" : "healthy";
          return { ...source, latest_item_at: latestMs === null ? null : new Date(latestMs).toISOString(), items_24h: items24h, items_7d: items.length, covered_7d: covered7d, health_status: healthStatus, coverage_rate_7d: items.length === 0 ? 0 : Math.round((covered7d / items.length) * 1000) / 10 };
        }).sort((a, b) => a.source_name.localeCompare(b.source_name));

        const statusCounts = sources.reduce<Record<string, number>>((acc, row) => { acc[row.health_status] = (acc[row.health_status] ?? 0) + 1; return acc; }, {});
        const flyoverCoverage = flyoverSpecs.map((spec) => {
          const feedMatch = feedRows.find((row) => matchesSpec(`${row.title} ${row.description ?? ""}`, spec));
          const publicationRows = spec.expectedSite === "keeptxred" ? ktrPublishedRows : texasDefinedPublishedSample;
          const publishedMatch = publicationRows.find((row) => matchesSpec(row.title, spec));
          return {
            key: spec.key,
            expectedSite: spec.expectedSite,
            ingested: Boolean(feedMatch),
            routedSite: feedMatch?.target_site ?? null,
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
          flyoverIngestedCount: flyoverCoverage.filter((item) => item.ingested).length,
          flyoverRoutedCorrectlyCount: flyoverCoverage.filter((item) => item.routedCorrectly === true).length,
          flyoverPublishedCount: flyoverCoverage.filter((item) => item.published).length,
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
