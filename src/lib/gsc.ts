// Google Search Console feedback storage — metadata-only article maintenance.
// OAuth/fetch lives in the scheduled GSC sync workflow; this module only applies
// normalized metrics from a trusted server route.

export type GscRow = {
  slug: string;
  impressions: number;
  clicks: number;
  ctr?: number | null;
  position?: number | null;
};

type AggregatedGscRow = {
  slug: string;
  impressions: number;
  clicks: number;
  positionWeighted: number;
  positionWeight: number;
};

export type GscWindow = {
  startDate?: string | null;
  endDate?: string | null;
};

const MAX_REDIRECT_HOPS = 8;

function resolveCanonicalSlug(slug: string, redirects: Map<string, string>): string {
  let current = slug;
  const seen = new Set<string>();
  for (let hop = 0; hop < MAX_REDIRECT_HOPS; hop++) {
    if (seen.has(current)) break;
    seen.add(current);
    const next = redirects.get(current);
    if (!next || next === current) break;
    current = next;
  }
  return current;
}

export async function applyGscMetrics(rows: GscRow[], window: GscWindow = {}): Promise<{
  updated: number;
  dailyArticlesUpdated: number;
  unmatched: string[];
  aliasesResolved: number;
}> {
  if (!rows || rows.length === 0) {
    return { updated: 0, dailyArticlesUpdated: 0, unmatched: [], aliasesResolved: 0 };
  }
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const db = supabaseAdmin as any;
  const now = new Date().toISOString();

  const { data: redirectRows, error: redirectError } = await db
    .from("article_slug_redirects")
    .select("old_slug,new_slug")
    .limit(5000);
  if (redirectError) throw new Error(`Failed to load article slug redirects: ${redirectError.message}`);

  const redirects = new Map<string, string>();
  for (const row of redirectRows ?? []) {
    const oldSlug = String((row as { old_slug?: unknown }).old_slug ?? "").trim();
    const newSlug = String((row as { new_slug?: unknown }).new_slug ?? "").trim();
    if (oldSlug && newSlug && oldSlug !== newSlug) redirects.set(oldSlug, newSlug);
  }

  let aliasesResolved = 0;
  const aggregated = new Map<string, AggregatedGscRow>();
  for (const row of rows) {
    const canonicalSlug = resolveCanonicalSlug(row.slug, redirects);
    if (canonicalSlug !== row.slug) aliasesResolved += 1;

    const impressions = Math.max(0, Number(row.impressions) || 0);
    const clicks = Math.max(0, Number(row.clicks) || 0);
    const position = Number.isFinite(Number(row.position)) ? Number(row.position) : null;
    const current = aggregated.get(canonicalSlug) ?? {
      slug: canonicalSlug,
      impressions: 0,
      clicks: 0,
      positionWeighted: 0,
      positionWeight: 0,
    };
    current.impressions += impressions;
    current.clicks += clicks;
    if (position !== null && impressions > 0) {
      current.positionWeighted += position * impressions;
      current.positionWeight += impressions;
    }
    aggregated.set(canonicalSlug, current);
  }

  const metricRows = [...aggregated.values()].map((row) => {
    const impressions = Math.max(0, Math.round(row.impressions));
    const clicks = Math.max(0, Math.round(row.clicks));
    const position = row.positionWeight > 0 ? row.positionWeighted / row.positionWeight : null;
    return {
      slug: row.slug,
      gsc_impressions: impressions,
      gsc_clicks: clicks,
      gsc_ctr: impressions > 0 ? clicks / impressions : null,
      gsc_avg_position: position,
      window_start: window.startDate || null,
      window_end: window.endDate || null,
      gsc_last_update: now,
    };
  });

  const { error: metricError } = await db
    .from("article_search_metrics")
    .upsert(metricRows, { onConflict: "slug" });
  if (metricError) throw new Error(`Failed to persist canonical GSC metrics: ${metricError.message}`);

  let dailyArticlesUpdated = 0;
  const unmatched: string[] = [];
  for (const row of metricRows) {
    const { data, error } = await db
      .from("daily_articles")
      .update({
        gsc_impressions: row.gsc_impressions,
        gsc_clicks: row.gsc_clicks,
        gsc_ctr: row.gsc_ctr,
        gsc_avg_position: row.gsc_avg_position,
        gsc_last_update: row.gsc_last_update,
      })
      .eq("slug", row.slug)
      .select("slug");

    if (error) throw new Error(`Failed to apply compatibility GSC metrics for ${row.slug}: ${error.message}`);
    if (data && data.length > 0) dailyArticlesUpdated += data.length;
    else unmatched.push(row.slug);
  }

  return {
    updated: metricRows.length,
    dailyArticlesUpdated,
    unmatched,
    aliasesResolved,
  };
}

export async function fetchSiteAverageCtr(): Promise<number | null> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const db = supabaseAdmin as any;
  const { data, error } = await db
    .from("article_search_metrics")
    .select("gsc_impressions,gsc_clicks")
    .gt("gsc_impressions", 0);
  if (error || !data || data.length === 0) return null;
  const imp = data.reduce((s: number, r: { gsc_impressions: number }) => s + (r.gsc_impressions ?? 0), 0);
  const clk = data.reduce((s: number, r: { gsc_clicks: number }) => s + (r.gsc_clicks ?? 0), 0);
  return imp > 0 ? clk / imp : null;
}
