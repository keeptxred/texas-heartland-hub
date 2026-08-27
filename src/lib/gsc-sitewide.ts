export type GscDailyPageMetric = {
  metricDate: string;
  url: string;
  path: string;
  impressions: number;
  clicks: number;
  ctr?: number | null;
  position?: number | null;
};

export type GscUrlInspection = {
  url: string;
  path: string;
  verdict?: string | null;
  coverageState?: string | null;
  robotsTxtState?: string | null;
  indexingState?: string | null;
  pageFetchState?: string | null;
  lastCrawlTime?: string | null;
  googleCanonical?: string | null;
  userCanonical?: string | null;
  sitemap?: string[];
  referringUrls?: string[];
  inspectionResultLink?: string | null;
};

export async function applyGscSitewideMetrics(rows: GscDailyPageMetric[]): Promise<number> {
  if (rows.length === 0) return 0;

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const db = supabaseAdmin as any;
  const syncedAt = new Date().toISOString();
  const payload = rows.map((row) => ({
    metric_date: row.metricDate,
    url: row.url,
    path: row.path,
    impressions: Math.max(0, Math.round(Number(row.impressions) || 0)),
    clicks: Math.max(0, Math.round(Number(row.clicks) || 0)),
    ctr: row.ctr == null ? null : Number(row.ctr),
    avg_position: row.position == null ? null : Number(row.position),
    synced_at: syncedAt,
  }));

  const { error } = await db
    .from("gsc_page_daily_metrics")
    .upsert(payload, { onConflict: "metric_date,url" });
  if (error) throw new Error(`Failed to persist sitewide GSC page metrics: ${error.message}`);
  return payload.length;
}

export async function applyGscUrlInspections(rows: GscUrlInspection[]): Promise<number> {
  if (rows.length === 0) return 0;

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const db = supabaseAdmin as any;
  const inspectedAt = new Date().toISOString();
  const payload = rows.map((row) => ({
    url: row.url,
    path: row.path,
    verdict: row.verdict ?? null,
    coverage_state: row.coverageState ?? null,
    robots_txt_state: row.robotsTxtState ?? null,
    indexing_state: row.indexingState ?? null,
    page_fetch_state: row.pageFetchState ?? null,
    last_crawl_time: row.lastCrawlTime ?? null,
    google_canonical: row.googleCanonical ?? null,
    user_canonical: row.userCanonical ?? null,
    sitemap: Array.isArray(row.sitemap) ? row.sitemap : [],
    referring_urls: Array.isArray(row.referringUrls) ? row.referringUrls : [],
    inspection_result_link: row.inspectionResultLink ?? null,
    inspected_at: inspectedAt,
  }));

  const { error } = await db
    .from("gsc_url_inspection")
    .upsert(payload, { onConflict: "url" });
  if (error) throw new Error(`Failed to persist GSC URL inspection data: ${error.message}`);
  return payload.length;
}
