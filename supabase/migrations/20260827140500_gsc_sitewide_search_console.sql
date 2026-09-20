-- Sitewide Google Search Console storage.
-- Keeps the existing article_search_metrics contract untouched while adding
-- daily performance history for every canonical KeepTXRed URL plus current
-- URL Inspection state for sitemap-discovered pages.

CREATE TABLE IF NOT EXISTS public.gsc_page_daily_metrics (
  metric_date date NOT NULL,
  url text NOT NULL,
  path text NOT NULL,
  impressions bigint NOT NULL DEFAULT 0,
  clicks bigint NOT NULL DEFAULT 0,
  ctr numeric,
  avg_position numeric,
  synced_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (metric_date, url),
  CONSTRAINT gsc_page_daily_metrics_url_check CHECK (url ~ '^https://keeptxred\\.com(?:/|$)'),
  CONSTRAINT gsc_page_daily_metrics_path_check CHECK (path ~ '^/'),
  CONSTRAINT gsc_page_daily_metrics_impressions_check CHECK (impressions >= 0),
  CONSTRAINT gsc_page_daily_metrics_clicks_check CHECK (clicks >= 0)
);

CREATE INDEX IF NOT EXISTS gsc_page_daily_metrics_date_idx ON public.gsc_page_daily_metrics (metric_date DESC);
CREATE INDEX IF NOT EXISTS gsc_page_daily_metrics_path_idx ON public.gsc_page_daily_metrics (path, metric_date DESC);
COMMENT ON TABLE public.gsc_page_daily_metrics IS 'Daily Search Console page performance for canonical KeepTXRed URLs. Server-only; retains history beyond third-party SEO tooling.';
ALTER TABLE public.gsc_page_daily_metrics ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.gsc_page_daily_metrics FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gsc_page_daily_metrics TO service_role;

CREATE TABLE IF NOT EXISTS public.gsc_url_inspection (
  url text PRIMARY KEY,
  path text NOT NULL,
  verdict text,
  coverage_state text,
  robots_txt_state text,
  indexing_state text,
  page_fetch_state text,
  last_crawl_time timestamptz,
  google_canonical text,
  user_canonical text,
  sitemap text[] NOT NULL DEFAULT '{}'::text[],
  referring_urls text[] NOT NULL DEFAULT '{}'::text[],
  inspection_result_link text,
  inspected_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT gsc_url_inspection_url_check CHECK (url ~ '^https://keeptxred\\.com(?:/|$)'),
  CONSTRAINT gsc_url_inspection_path_check CHECK (path ~ '^/')
);

CREATE UNIQUE INDEX IF NOT EXISTS gsc_url_inspection_path_idx ON public.gsc_url_inspection (path);
CREATE INDEX IF NOT EXISTS gsc_url_inspection_verdict_idx ON public.gsc_url_inspection (verdict, inspected_at DESC);
COMMENT ON TABLE public.gsc_url_inspection IS 'Latest Google Search Console URL Inspection state for canonical KeepTXRed sitemap URLs. Server-only.';
ALTER TABLE public.gsc_url_inspection ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.gsc_url_inspection FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gsc_url_inspection TO service_role;
