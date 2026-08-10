-- Persist the authoritative Keep TX Red content-pillar decision on feed rows.
-- Null pillar_slug is valid: it means the story belongs in general Texas News.

ALTER TABLE public.texas_news_feed
  ADD COLUMN IF NOT EXISTS pillar_slug text,
  ADD COLUMN IF NOT EXISTS pillar_classified_at timestamptz;

ALTER TABLE public.texas_news_feed
  DROP CONSTRAINT IF EXISTS texas_news_feed_pillar_slug_check;

ALTER TABLE public.texas_news_feed
  ADD CONSTRAINT texas_news_feed_pillar_slug_check CHECK (
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
  );

CREATE INDEX IF NOT EXISTS texas_news_feed_pillar_recent_idx
  ON public.texas_news_feed (pillar_slug, pub_date DESC)
  WHERE pillar_slug IS NOT NULL;

COMMENT ON COLUMN public.texas_news_feed.pillar_slug IS
  'Authoritative Keep TX Red content-pillar slug assigned by the shared deterministic TypeScript taxonomy. Null is valid general Texas News.';
COMMENT ON COLUMN public.texas_news_feed.pillar_classified_at IS
  'Timestamp when pillar classification was evaluated, including rows intentionally left in general Texas News.';

-- Recreate the admin coverage-gap view with pillar visibility. Existing view
-- columns keep their original order so CREATE OR REPLACE VIEW remains safe;
-- new pillar fields are appended at the end.
CREATE OR REPLACE VIEW public.news_coverage_gaps AS
SELECT
  id,
  title,
  source,
  link,
  pub_date,
  category,
  internal_slug,
  viral_score,
  classification_confidence,
  texas_relevance_score,
  source_reputation_score,
  routing_type,
  CASE
    WHEN internal_slug IS NOT NULL AND btrim(internal_slug) <> '' THEN 'covered'
    WHEN coalesce(texas_relevance_score, 0) < 40 THEN 'low_texas_relevance'
    WHEN coalesce(source_reputation_score, 0) < 55 THEN 'low_source_reputation'
    WHEN coalesce(classification_confidence, 0) < 0.60 THEN 'low_classification_confidence'
    WHEN coalesce(viral_score, 0) < 55 THEN 'below_article_score'
    WHEN routing_type IN ('FACEBOOK_ONLY', 'REEL_CANDIDATE') THEN 'routing_gate'
    ELSE 'article_generation_or_publish_gap'
  END AS gap_reason,
  GREATEST(coalesce(texas_relevance_score, 0), coalesce(viral_score, 0)) AS coverage_priority,
  pillar_slug,
  pillar_classified_at
FROM public.texas_news_feed
WHERE (internal_slug IS NULL OR btrim(internal_slug) = '')
  AND pub_date >= now() - interval '7 days'
  AND (
    coalesce(texas_relevance_score, 0) >= 40
    OR coalesce(viral_score, 0) >= 55
    OR routing_type IN ('SEO_ARTICLE', 'BOTH')
  );

GRANT SELECT ON public.news_coverage_gaps TO anon;
GRANT SELECT ON public.news_coverage_gaps TO authenticated;
GRANT SELECT ON public.news_coverage_gaps TO service_role;

-- Classify two minutes after each :07/:37 ingest and before the :12/:42 viral
-- scoring run. The hook also backfills older unclassified rows. Published
-- consumers resolve the persisted decision through the existing feed-to-slug link.
DO $$
DECLARE
  existing_job_id bigint;
BEGIN
  SELECT jobid INTO existing_job_id
  FROM cron.job
  WHERE jobname = 'keep-tx-red-classify-pillars'
  LIMIT 1;
  IF existing_job_id IS NOT NULL THEN
    PERFORM cron.unschedule(existing_job_id);
  END IF;
END
$$;

SELECT cron.schedule(
  'keep-tx-red-classify-pillars',
  '9,39 * * * *',
  $$
    SELECT net.http_post(
      url := 'https://keeptxred.com/api/public/hooks/classify-pillars',
      headers := '{"Content-Type":"application/json","Accept":"application/json"}'::jsonb,
      body := '{"source":"pg_cron"}'::jsonb,
      timeout_milliseconds := 120000
    );
  $$
);
