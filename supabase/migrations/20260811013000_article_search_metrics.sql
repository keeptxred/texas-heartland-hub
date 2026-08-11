-- Store Search Console performance by canonical public /news/:slug identity.
-- This decouples GSC metrics from whether the page is backed by static ARTICLES
-- or daily_articles, while preserving daily_articles compatibility updates.

CREATE TABLE IF NOT EXISTS public.article_search_metrics (
  slug text PRIMARY KEY,
  gsc_impressions bigint NOT NULL DEFAULT 0,
  gsc_clicks bigint NOT NULL DEFAULT 0,
  gsc_ctr numeric,
  gsc_avg_position numeric,
  window_start date,
  window_end date,
  gsc_last_update timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT article_search_metrics_slug_check CHECK (slug ~ '^[A-Za-z0-9][A-Za-z0-9-]{2,220}$'),
  CONSTRAINT article_search_metrics_impressions_check CHECK (gsc_impressions >= 0),
  CONSTRAINT article_search_metrics_clicks_check CHECK (gsc_clicks >= 0)
);

COMMENT ON TABLE public.article_search_metrics IS
  'Canonical Search Console performance keyed by public Keep TX Red /news/:slug URL, independent of article storage backend.';

ALTER TABLE public.article_search_metrics ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.article_search_metrics TO service_role;

CREATE OR REPLACE VIEW public.pillar_authority_metrics AS
WITH pillars(slug, title, target_articles) AS (
  VALUES
    ('texas-politics-government', 'Politics & Government', 30),
    ('texas-elections', 'Elections', 30),
    ('texas-border-immigration', 'Border & Immigration', 25),
    ('texas-energy-oil', 'Energy & Oil', 25),
    ('texas-economy-small-business', 'Economy & Small Business', 25),
    ('texas-agriculture-rural', 'Agriculture & Rural Texas', 20),
    ('texas-veterans-military', 'Veterans & Military', 20),
    ('texas-law-enforcement-public-safety', 'Law Enforcement & Public Safety', 20),
    ('texas-laws-legislature', 'Laws & Legislature', 30)
), article_rollup AS (
  SELECT
    a.pillar_slug,
    count(*) FILTER (WHERE d.slug IS NOT NULL) AS article_count,
    count(*) FILTER (WHERE d.published_at >= now() - interval '30 days') AS articles_30d,
    max(d.published_at) AS latest_published_at,
    coalesce(sum(m.gsc_impressions), 0) AS gsc_impressions,
    coalesce(sum(m.gsc_clicks), 0) AS gsc_clicks,
    CASE WHEN coalesce(sum(m.gsc_impressions), 0) > 0
      THEN coalesce(sum(m.gsc_clicks), 0)::numeric / sum(m.gsc_impressions)
      ELSE NULL END AS gsc_ctr,
    CASE WHEN coalesce(sum(m.gsc_impressions), 0) > 0
      THEN sum(m.gsc_avg_position * m.gsc_impressions)::numeric / sum(m.gsc_impressions)
      ELSE NULL END AS avg_search_position
  FROM public.article_pillar_assignments a
  LEFT JOIN public.daily_articles d ON d.slug = a.article_slug
  LEFT JOIN public.article_search_metrics m ON m.slug = a.article_slug
  WHERE a.pillar_slug IS NOT NULL
  GROUP BY a.pillar_slug
)
SELECT
  p.slug AS pillar_slug,
  p.title,
  p.target_articles,
  coalesce(r.article_count, 0)::bigint AS article_count,
  coalesce(r.articles_30d, 0)::bigint AS articles_30d,
  r.latest_published_at,
  coalesce(r.gsc_impressions, 0)::bigint AS gsc_impressions,
  coalesce(r.gsc_clicks, 0)::bigint AS gsc_clicks,
  r.gsc_ctr,
  r.avg_search_position,
  least(100, round((coalesce(r.article_count, 0)::numeric / p.target_articles) * 100))::int AS depth_score,
  CASE
    WHEN coalesce(r.article_count, 0) < p.target_articles * 0.40 THEN 'critical'
    WHEN coalesce(r.article_count, 0) < p.target_articles * 0.75 THEN 'thin'
    WHEN coalesce(r.article_count, 0) < p.target_articles THEN 'building'
    ELSE 'established'
  END AS authority_status
FROM pillars p
LEFT JOIN article_rollup r ON r.pillar_slug = p.slug;

COMMENT ON VIEW public.pillar_authority_metrics IS
  'Nine-pillar authority dashboard: library depth, recent publishing cadence, and canonical public-URL Search Console performance.';

GRANT SELECT ON public.pillar_authority_metrics TO anon;
GRANT SELECT ON public.pillar_authority_metrics TO authenticated;
GRANT SELECT ON public.pillar_authority_metrics TO service_role;
