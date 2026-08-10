import { createFileRoute } from "@tanstack/react-router";

type SourceRow = {
  source_name: string;
  rss_url: string;
  category: string | null;
};

type FeedRow = {
  source: string;
  pub_date: string | null;
  internal_slug: string | null;
};

type SourceHealthRow = SourceRow & {
  latest_item_at: string | null;
  items_24h: number;
  items_7d: number;
  covered_7d: number;
  health_status: "healthy" | "quiet" | "stale" | "never_seen";
  coverage_rate_7d: number;
};

export const Route = createFileRoute("/api/public/newsroom-health")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const now = Date.now();
        const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
        const oneDayAgoMs = now - 24 * 60 * 60 * 1000;
        const twoDaysAgoMs = now - 48 * 60 * 60 * 1000;
        const sevenDaysAgoMs = now - 7 * 24 * 60 * 60 * 1000;

        const [gapResult, sourcesResult, feedResult] = await Promise.all([
          supabaseAdmin
            .from("news_coverage_gaps" as never)
            .select("id", { count: "exact", head: true }),
          supabaseAdmin
            .from("content_sources" as never)
            .select("source_name,rss_url,category")
            .eq("enabled", true)
            .not("rss_url", "is", null),
          supabaseAdmin
            .from("texas_news_feed" as never)
            .select("source,pub_date,internal_slug")
            .gte("pub_date", sevenDaysAgo),
        ]);

        const errors = [gapResult.error?.message, sourcesResult.error?.message, feedResult.error?.message].filter(Boolean);
        if (errors.length > 0) {
          return new Response(JSON.stringify({ ok: false, databaseViewsReady: false, errors }), {
            status: 503,
            headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
          });
        }

        const sourceRows = (sourcesResult.data ?? []) as unknown as SourceRow[];
        const feedRows = (feedResult.data ?? []) as unknown as FeedRow[];
        const feedBySource = new Map<string, FeedRow[]>();
        for (const row of feedRows) {
          const key = String(row.source || "").trim().toLowerCase();
          if (!key) continue;
          const list = feedBySource.get(key) ?? [];
          list.push(row);
          feedBySource.set(key, list);
        }

        const sources: SourceHealthRow[] = sourceRows
          .map((source) => {
            const items = feedBySource.get(source.source_name.trim().toLowerCase()) ?? [];
            const timestamps = items
              .map((item) => (item.pub_date ? Date.parse(item.pub_date) : Number.NaN))
              .filter(Number.isFinite);
            const latestMs = timestamps.length > 0 ? Math.max(...timestamps) : null;
            const items24h = timestamps.filter((timestamp) => timestamp >= oneDayAgoMs).length;
            const covered7d = items.filter((item) => Boolean(item.internal_slug?.trim())).length;
            const healthStatus: SourceHealthRow["health_status"] =
              latestMs === null
                ? "never_seen"
                : latestMs < sevenDaysAgoMs
                  ? "stale"
                  : latestMs < twoDaysAgoMs
                    ? "quiet"
                    : "healthy";

            return {
              ...source,
              latest_item_at: latestMs === null ? null : new Date(latestMs).toISOString(),
              items_24h: items24h,
              items_7d: items.length,
              covered_7d: covered7d,
              health_status: healthStatus,
              coverage_rate_7d: items.length === 0 ? 0 : Math.round((covered7d / items.length) * 1000) / 10,
            };
          })
          .sort((a, b) => a.source_name.localeCompare(b.source_name));

        const statusCounts = sources.reduce<Record<string, number>>((acc, row) => {
          acc[row.health_status] = (acc[row.health_status] ?? 0) + 1;
          return acc;
        }, {});

        return new Response(
          JSON.stringify({
            ok: true,
            databaseViewsReady: true,
            coverageGapCount: gapResult.count ?? 0,
            sourceCount: sources.length,
            sourceStatusCounts: statusCounts,
            items24h: sources.reduce((sum, row) => sum + row.items_24h, 0),
            items7d: sources.reduce((sum, row) => sum + row.items_7d, 0),
            covered7d: sources.reduce((sum, row) => sum + row.covered_7d, 0),
            sources,
            checkedAt: new Date().toISOString(),
          }),
          {
            headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
          },
        );
      },
    },
  },
});
