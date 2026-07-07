// Google Search Console feedback storage — data layer only.
// No OAuth, no fetch. Ready for future integration.
//
// Usage from a trusted server context (server fn / route handler):
//   await applyGscMetrics([{ slug, impressions, clicks, ctr, position }])

export type GscRow = {
  slug: string;
  impressions: number;
  clicks: number;
  ctr?: number | null;
  position?: number | null;
};

export async function applyGscMetrics(rows: GscRow[]): Promise<{ updated: number }> {
  if (!rows || rows.length === 0) return { updated: 0 };
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const now = new Date().toISOString();
  let updated = 0;
  for (const r of rows) {
    const { error } = await supabaseAdmin
      .from("daily_articles")
      .update({
        gsc_impressions: Math.max(0, Math.round(r.impressions)),
        gsc_clicks: Math.max(0, Math.round(r.clicks)),
        gsc_ctr: r.ctr ?? (r.impressions > 0 ? r.clicks / r.impressions : null),
        gsc_avg_position: r.position ?? null,
        gsc_last_update: now,
      })
      .eq("slug", r.slug);
    if (!error) updated++;
  }
  return { updated };
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