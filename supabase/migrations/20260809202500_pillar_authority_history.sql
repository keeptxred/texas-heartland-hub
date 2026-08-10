-- Preserve daily pillar-authority history so editorial decisions are based on
-- direction as well as the current snapshot. This reads the existing
-- pillar_authority_metrics view and never writes daily_articles.

CREATE TABLE IF NOT EXISTS public.pillar_authority_snapshots (
  pillar_slug text NOT NULL,
  snapshot_date date NOT NULL DEFAULT CURRENT_DATE,
  target_articles integer NOT NULL,
  article_count bigint NOT NULL,
  articles_30d bigint NOT NULL,
  latest_published_at timestamptz,
  gsc_impressions bigint NOT NULL DEFAULT 0,
  gsc_clicks bigint NOT NULL DEFAULT 0,
  gsc_ctr numeric,
  avg_search_position numeric,
  depth_score integer NOT NULL,
  authority_status text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (pillar_slug, snapshot_date),
  CONSTRAINT pillar_authority_snapshots_pillar_check CHECK (
    pillar_slug IN (
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
  ),
  CONSTRAINT pillar_authority_snapshots_status_check CHECK (
    authority_status IN ('critical', 'thin', 'building', 'established')
  )
);

CREATE INDEX IF NOT EXISTS pillar_authority_snapshots_date_idx
  ON public.pillar_authority_snapshots (snapshot_date DESC, pillar_slug);

COMMENT ON TABLE public.pillar_authority_snapshots IS
  'Daily historical snapshots of Keep TX Red pillar depth, publishing cadence, and stored Search Console performance.';

CREATE OR REPLACE FUNCTION public.capture_pillar_authority_snapshot()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE inserted_count integer;
BEGIN
  INSERT INTO public.pillar_authority_snapshots (
    pillar_slug,
    snapshot_date,
    target_articles,
    article_count,
    articles_30d,
    latest_published_at,
    gsc_impressions,
    gsc_clicks,
    gsc_ctr,
    avg_search_position,
    depth_score,
    authority_status
  )
  SELECT
    pillar_slug,
    CURRENT_DATE,
    target_articles,
    article_count,
    articles_30d,
    latest_published_at,
    gsc_impressions,
    gsc_clicks,
    gsc_ctr,
    avg_search_position,
    depth_score,
    authority_status
  FROM public.pillar_authority_metrics
  ON CONFLICT (pillar_slug, snapshot_date) DO UPDATE SET
    target_articles = excluded.target_articles,
    article_count = excluded.article_count,
    articles_30d = excluded.articles_30d,
    latest_published_at = excluded.latest_published_at,
    gsc_impressions = excluded.gsc_impressions,
    gsc_clicks = excluded.gsc_clicks,
    gsc_ctr = excluded.gsc_ctr,
    avg_search_position = excluded.avg_search_position,
    depth_score = excluded.depth_score,
    authority_status = excluded.authority_status,
    created_at = now();

  GET DIAGNOSTICS inserted_count = ROW_COUNT;
  RETURN inserted_count;
END;
$$;

-- Seed today's state during migration so trend reporting is immediately usable.
SELECT public.capture_pillar_authority_snapshot();

CREATE OR REPLACE VIEW public.pillar_authority_trends AS
WITH current_metrics AS (
  SELECT * FROM public.pillar_authority_metrics
), prior_7 AS (
  SELECT DISTINCT ON (pillar_slug)
    pillar_slug,
    snapshot_date,
    article_count,
    articles_30d,
    gsc_impressions,
    gsc_clicks,
    gsc_ctr,
    avg_search_position,
    depth_score
  FROM public.pillar_authority_snapshots
  WHERE snapshot_date <= CURRENT_DATE - 7
  ORDER BY pillar_slug, snapshot_date DESC
), prior_30 AS (
  SELECT DISTINCT ON (pillar_slug)
    pillar_slug,
    snapshot_date,
    article_count,
    gsc_impressions,
    gsc_clicks,
    depth_score
  FROM public.pillar_authority_snapshots
  WHERE snapshot_date <= CURRENT_DATE - 30
  ORDER BY pillar_slug, snapshot_date DESC
)
SELECT
  c.*,
  p7.snapshot_date AS comparison_7d_date,
  (c.article_count - coalesce(p7.article_count, c.article_count))::bigint AS article_delta_7d,
  (c.gsc_impressions - coalesce(p7.gsc_impressions, c.gsc_impressions))::bigint AS impressions_delta_7d,
  (c.gsc_clicks - coalesce(p7.gsc_clicks, c.gsc_clicks))::bigint AS clicks_delta_7d,
  (c.depth_score - coalesce(p7.depth_score, c.depth_score))::integer AS depth_delta_7d,
  CASE
    WHEN p7.avg_search_position IS NULL OR c.avg_search_position IS NULL THEN NULL
    ELSE p7.avg_search_position - c.avg_search_position
  END AS search_position_improvement_7d,
  p30.snapshot_date AS comparison_30d_date,
  (c.article_count - coalesce(p30.article_count, c.article_count))::bigint AS article_delta_30d,
  (c.gsc_impressions - coalesce(p30.gsc_impressions, c.gsc_impressions))::bigint AS impressions_delta_30d,
  (c.depth_score - coalesce(p30.depth_score, c.depth_score))::integer AS depth_delta_30d,
  CASE
    WHEN c.authority_status = 'critical' THEN 'Build cornerstone and supporting coverage now'
    WHEN c.authority_status = 'thin' AND c.articles_30d = 0 THEN 'Publish fresh supporting coverage this week'
    WHEN c.authority_status = 'thin' THEN 'Add supporting evergreen depth'
    WHEN c.authority_status = 'building' AND c.articles_30d < 2 THEN 'Increase publishing cadence'
    WHEN coalesce(c.gsc_impressions, 0) > 100 AND coalesce(c.gsc_ctr, 0) < 0.01 THEN 'Improve titles and search snippets'
    WHEN c.avg_search_position BETWEEN 8 AND 20 THEN 'Strengthen internal links and refresh ranking pages'
    ELSE 'Maintain coverage and monitor trend'
  END AS recommended_action
FROM current_metrics c
LEFT JOIN prior_7 p7 ON p7.pillar_slug = c.pillar_slug
LEFT JOIN prior_30 p30 ON p30.pillar_slug = c.pillar_slug;

COMMENT ON VIEW public.pillar_authority_trends IS
  'Current nine-pillar authority metrics with seven- and thirty-day trend deltas plus deterministic editorial next actions.';

GRANT SELECT ON public.pillar_authority_snapshots TO authenticated;
GRANT SELECT ON public.pillar_authority_snapshots TO service_role;
GRANT SELECT ON public.pillar_authority_trends TO anon;
GRANT SELECT ON public.pillar_authority_trends TO authenticated;
GRANT SELECT ON public.pillar_authority_trends TO service_role;

DO $$
DECLARE existing_job_id bigint;
BEGIN
  SELECT jobid INTO existing_job_id FROM cron.job
  WHERE jobname = 'keep-tx-red-snapshot-pillar-authority' LIMIT 1;
  IF existing_job_id IS NOT NULL THEN
    PERFORM cron.unschedule(existing_job_id);
  END IF;
END
$$;

-- Capture once per day after overnight publishing/indexing maintenance.
SELECT cron.schedule(
  'keep-tx-red-snapshot-pillar-authority',
  '17 4 * * *',
  $$ SELECT public.capture_pillar_authority_snapshot(); $$
);
