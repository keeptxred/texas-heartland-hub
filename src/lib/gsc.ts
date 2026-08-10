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

export async function applyGscMetrics(rows: GscRow[]): Promise<{ updated: number; unmatched: string[] }> {
  if (!rows || rows.length === 0) return { updated: 0, unmatched: [] };
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const now = new Date().toISOString();
  let updated = 0;
  const unmatched: string[] = [];

  for (const r of rows) {
    const { data, error } = await supabaseAdmin
      .from("daily_articles")
      .update({
        gsc_impressions: Math.max(0, Math.round(r.impressions)),
        gsc_clicks: Math.max(0, Math.round(r.clicks)),
        gsc_ctr: r.ctr ?? (r.impressions > 0 ? r.clicks / r.impressions : null),
        gsc_avg_position: r.position ?? null,
        gsc_last_update: now,
      })
      .eq("slug", r.slug)
      .select("slug");

    if (error) throw new Error(`Failed to apply GSC metrics for ${r.slug}: ${error.message}`);
    if (data && data.length > 0) updated += data.length;
    else unmatched.push(r.slug);
  }

  return { updated, unmatched };
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
