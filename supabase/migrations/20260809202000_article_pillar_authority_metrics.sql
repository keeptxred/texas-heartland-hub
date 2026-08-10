-- Backfill and measure the existing Keep TX Red article library without
-- making daily_articles itself another taxonomy writer.

CREATE TABLE IF NOT EXISTS public.article_pillar_assignments (
  article_slug text PRIMARY KEY,
  pillar_slug text,
  classified_at timestamptz NOT NULL DEFAULT now(),
  classifier_version text NOT NULL DEFAULT 'content-pillars-v1',
  CONSTRAINT article_pillar_assignments_pillar_check CHECK (
    pillar_slug IS NULL OR pillar_slug IN (
      'texas-politics-government',
      'texas-elections',
      'texas-border-immigration',
      'texas-energy-oil',
      'texas-economy-small-business',
      'texas-agriculture-rural',
      'texas-veterans-military',
      'texas-law-enforcement-public-safety',
      'texas-laws-legislature'
    )
  )
);

CREATE INDEX IF NOT EXISTS article_pillar_assignments_pillar_idx
  ON public.article_pillar_assignments (pillar_slug, classified_at DESC)
  WHERE pillar_slug IS NOT NULL;

COMMENT ON TABLE public.article_pillar_assignments IS
  'Deterministic relationship between existing Keep TX Red articles and the authoritative nine-pillar taxonomy. Null pillar_slug is a completed General Texas News classification.';

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
    coalesce(sum(d.gsc_impressions), 0) AS gsc_impressions,
    coalesce(sum(d.gsc_clicks), 0) AS gsc_clicks,
    CASE WHEN coalesce(sum(d.gsc_impressions), 0) > 0
      THEN coalesce(sum(d.gsc_clicks), 0)::numeric / sum(d.gsc_impressions)
      ELSE NULL END AS gsc_ctr,
    CASE WHEN count(d.gsc_avg_position) > 0
      THEN avg(d.gsc_avg_position)
      ELSE NULL END AS avg_search_position
  FROM public.article_pillar_assignments a
  LEFT JOIN public.daily_articles d ON d.slug = a.article_slug
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
  'Nine-pillar authority dashboard: library depth, recent publishing cadence, and stored Search Console performance.';

GRANT SELECT ON public.pillar_authority_metrics TO anon;
GRANT SELECT ON public.pillar_authority_metrics TO authenticated;
GRANT SELECT ON public.pillar_authority_metrics TO service_role;

-- Backfill older articles in small deterministic batches. No AI is used.
DO $$
DECLARE existing_job_id bigint;
BEGIN
  SELECT jobid INTO existing_job_id FROM cron.job
  WHERE jobname = 'keep-tx-red-classify-article-pillars' LIMIT 1;
  IF existing_job_id IS NOT NULL THEN
    PERFORM cron.unschedule(existing_job_id);
  END IF;
END
$$;

SELECT cron.schedule(
  'keep-tx-red-classify-article-pillars',
  '24 * * * *',
  $$
    SELECT net.http_post(
      url := 'https://keeptxred.com/api/public/hooks/classify-article-pillars',
      headers := '{"Content-Type":"application/json","Accept":"application/json"}'::jsonb,
      body := '{"source":"pg_cron"}'::jsonb,
      timeout_milliseconds := 120000
    );
  $$
);