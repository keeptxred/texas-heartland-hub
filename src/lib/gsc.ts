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

export async function applyGscMetrics(rows: GscRow[]): Promise<{
  updated: number;
  unmatched: string[];
  aliasesResolved: number;
}> {
  if (!rows || rows.length === 0) return { updated: 0, unmatched: [], aliasesResolved: 0 };
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const now = new Date().toISOString();

  // Public /news/:slug resolution checks article_slug_redirects before
  // daily_articles. GSC can therefore continue reporting impressions against a
  // legacy URL after the article has moved. Mirror that public resolution here
  // so historical aliases roll up into the canonical article record.
  const { data: redirectRows, error: redirectError } = await supabaseAdmin
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

  let updated = 0;
  const unmatched: string[] = [];
  for (const row of aggregated.values()) {
    const impressions = Math.max(0, Math.round(row.impressions));
    const clicks = Math.max(0, Math.round(row.clicks));
    const position = row.positionWeight > 0 ? row.positionWeighted / row.positionWeight : null;
    const { data, error } = await supabaseAdmin
      .from("daily_articles")
      .update({
        gsc_impressions: impressions,
        gsc_clicks: clicks,
        gsc_ctr: impressions > 0 ? clicks / impressions : null,
        gsc_avg_position: position,
        gsc_last_update: now,
      })
      .eq("slug", row.slug)
      .select("slug");

    if (error) throw new Error(`Failed to apply GSC metrics for ${row.slug}: ${error.message}`);
    if (data && data.length > 0) updated += data.length;
    else unmatched.push(row.slug);
  }

  return { updated, unmatched, aliasesResolved };
}

/** Convenience: compute the site-wide average CTR from stored GSC data. */
export async function fetchSiteAverageCtr(): Promise<number | null> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("daily_articles")
    .select("gsc_impressions,gsc_clicks")
    .gt("gsc_impressions", 0);
  if (error || !data || data.length === 0) return null;
  const imp = data.reduce((s, r: { gsc_impressions: number }) => s + (r.gsc_impressions ?? 0), 0);
  const clk = data.reduce((s, r: { gsc_clicks: number }) => s + (r.gsc_clicks ?? 0), 0);
  return imp > 0 ? clk / imp : null;
}
