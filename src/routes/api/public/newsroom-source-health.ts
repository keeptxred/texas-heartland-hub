import { createFileRoute } from "@tanstack/react-router";

type EnabledSource = {
  source_name: string;
  rss_url: string | null;
  category: string | null;
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

type TransportStatus = "healthy" | "quiet" | "degraded" | "broken" | "stale_check" | "never_checked";
type MatchMode = "name" | "url" | null;

const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
const LATEST_INGESTION_COHORT_MS = 15 * 60 * 1000;
const ACTIVE_UNREGISTERED_LIMIT = 25;

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
  const successful = fetch.last_status != null && fetch.last_status >= 200 && fetch.last_status < 300;
  if ((fetch.consecutive_failures ?? 0) >= 2) return "broken";
  if (!successful) return "degraded";
  if ((fetch.last_item_count ?? 0) === 0) return "quiet";
  return "healthy";
}

function blankStatusCounts(): Record<TransportStatus, number> {
  return { healthy: 0, quiet: 0, degraded: 0, broken: 0, stale_check: 0, never_checked: 0 };
}

export const Route = createFileRoute("/api/public/newsroom-source-health")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const [sourcesResult, fetchResult] = await Promise.all([
          supabaseAdmin
            .from("content_sources" as never)
            .select("source_name,rss_url,category")
            .eq("enabled", true)
            .not("rss_url", "is", null),
          supabaseAdmin
            .from("news_source_fetch_state" as never)
            .select("source_name,source_url,last_checked_at,last_status,last_item_count,last_error,last_success_at,consecutive_failures,consecutive_empty"),
        ]);

        const errors = [sourcesResult.error?.message, fetchResult.error?.message].filter(Boolean);
        if (errors.length > 0) {
          return Response.json({ ok: false, errors }, { status: 503, headers: { "Cache-Control": "no-store" } });
        }

        const now = Date.now();
        const enabledSources = (sourcesResult.data ?? []) as unknown as EnabledSource[];
        const fetchStates = (fetchResult.data ?? []) as unknown as FetchState[];
        const fetchByName = new Map(fetchStates.map((row) => [normalizeName(row.source_name), row] as const));
        const fetchByUrl = new Map(
          fetchStates
            .map((row) => [normalizeUrl(row.source_url), row] as const)
            .filter(([url]) => Boolean(url)),
        );

        const registryNames = new Set(enabledSources.map((source) => normalizeName(source.source_name)));
        const registryUrls = new Set(enabledSources.map((source) => normalizeUrl(source.rss_url)).filter(Boolean));

        const rows = enabledSources.map((source) => {
          const byName = fetchByName.get(normalizeName(source.source_name)) ?? null;
          const byUrl = fetchByUrl.get(normalizeUrl(source.rss_url)) ?? null;
          const fetch = byName ?? byUrl;
          const matchMode: MatchMode = byName ? "name" : byUrl ? "url" : null;
          const status = classifyFetch(fetch, now);
          return {
            sourceName: source.source_name,
            sourceUrl: source.rss_url,
            category: source.category,
            status,
            matchMode,
            fetchStateSourceName: fetch?.source_name ?? null,
            lastCheckedAt: fetch?.last_checked_at ?? null,
            lastStatus: fetch?.last_status ?? null,
            lastItemCount: fetch?.last_item_count ?? null,
            lastError: fetch?.last_error ?? null,
            lastSuccessAt: fetch?.last_success_at ?? null,
            consecutiveFailures: fetch?.consecutive_failures ?? 0,
            consecutiveEmptyFetches: fetch?.consecutive_empty ?? 0,
          };
        }).sort((a, b) => a.sourceName.localeCompare(b.sourceName));

        const statusCounts = rows.reduce<Record<TransportStatus, number>>((acc, row) => {
          acc[row.status] += 1;
          return acc;
        }, blankStatusCounts());

        const degradedSources = rows
          .filter((row) => row.status === "degraded")
          .sort((a, b) => b.consecutiveFailures - a.consecutiveFailures)
          .slice(0, 25);

        const brokenSources = rows
          .filter((row) => row.status === "broken")
          .sort((a, b) => b.consecutiveFailures - a.consecutiveFailures)
          .slice(0, 25);

        // DIRECT_SOURCES and other runtime-only fetch paths do not necessarily
        // have content_sources rows. Surface unmatched rows only from the newest
        // ingestion cohort. That makes live hard-coded sources observable while
        // immediately excluding retired source history even if it is <2h old.
        const latestCheckedAt = fetchStates.reduce((latest, fetch) => {
          const checkedAt = Date.parse(fetch.last_checked_at);
          return Number.isFinite(checkedAt) ? Math.max(latest, checkedAt) : latest;
        }, 0);
        const activeCohortCutoff = Math.max(now - TWO_HOURS_MS, latestCheckedAt - LATEST_INGESTION_COHORT_MS);

        const activeUnregisteredSources = fetchStates
          .filter((fetch) => {
            const checkedAt = Date.parse(fetch.last_checked_at);
            if (!Number.isFinite(checkedAt) || checkedAt < activeCohortCutoff) return false;
            if (registryNames.has(normalizeName(fetch.source_name))) return false;
            const url = normalizeUrl(fetch.source_url);
            if (url && registryUrls.has(url)) return false;
            return true;
          })
          .map((fetch) => ({
            sourceName: fetch.source_name,
            sourceUrl: fetch.source_url,
            status: classifyFetch(fetch, now),
            lastCheckedAt: fetch.last_checked_at,
            lastStatus: fetch.last_status,
            lastItemCount: fetch.last_item_count,
            lastError: fetch.last_error,
            lastSuccessAt: fetch.last_success_at,
            consecutiveFailures: fetch.consecutive_failures,
            consecutiveEmptyFetches: fetch.consecutive_empty,
          }))
          .sort((a, b) => a.sourceName.localeCompare(b.sourceName));

        const activeUnregisteredStatusCounts = activeUnregisteredSources.reduce<Record<TransportStatus, number>>((acc, row) => {
          acc[row.status] += 1;
          return acc;
        }, blankStatusCounts());

        return Response.json({
          ok: true,
          sourceCount: rows.length,
          statusCounts,
          degradedSources,
          brokenSources,
          activeUnregisteredSourceCount: activeUnregisteredSources.length,
          activeUnregisteredStatusCounts,
          activeUnregisteredSources: activeUnregisteredSources.slice(0, ACTIVE_UNREGISTERED_LIMIT),
          rows,
          checkedAt: new Date().toISOString(),
        }, { headers: { "Cache-Control": "no-store" } });
      },
    },
  },
});
