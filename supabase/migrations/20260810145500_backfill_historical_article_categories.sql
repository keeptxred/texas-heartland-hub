-- BULK_CATEGORY_RECLASSIFICATION
-- Align the historical visible article category with the authoritative pillar
-- assignment. The public article route still supports the original broad
-- category vocabulary, so use the closest non-misleading legacy label while
-- the nine-pillar graph remains the canonical topical relationship layer.

CREATE TABLE IF NOT EXISTS public.article_category_reclassification_log (
  article_slug text PRIMARY KEY,
  old_category text,
  new_category text NOT NULL,
  pillar_slug text,
  reclassified_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.article_category_reclassification_log IS
  'Audit trail for historical daily_articles category corrections derived from canonical article_pillar_assignments.';

CREATE OR REPLACE FUNCTION public.legacy_article_category_for_pillar(pillar text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE pillar
    WHEN 'texas-politics-government' THEN 'Legislature'
    WHEN 'texas-elections' THEN 'Elections'
    WHEN 'texas-border-immigration' THEN 'Border'
    WHEN 'texas-energy-oil' THEN 'Energy'
    WHEN 'texas-economy-small-business' THEN 'Non-Political'
    WHEN 'texas-agriculture-rural' THEN 'Non-Political'
    WHEN 'texas-veterans-military' THEN 'Non-Political'
    WHEN 'texas-law-enforcement-public-safety' THEN 'Non-Political'
    WHEN 'texas-laws-legislature' THEN 'Legislature'
    ELSE 'Non-Political'
  END;
$$;

CREATE OR REPLACE FUNCTION public.sync_historical_article_categories_from_pillars()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  changed_count integer := 0;
BEGIN
  INSERT INTO public.article_category_reclassification_log (
    article_slug,
    old_category,
    new_category,
    pillar_slug,
    reclassified_at
  )
  SELECT
    d.slug,
    d.category,
    public.legacy_article_category_for_pillar(a.pillar_slug),
    a.pillar_slug,
    now()
  FROM public.daily_articles d
  JOIN public.article_pillar_assignments a ON a.article_slug = d.slug
  WHERE a.classifier_version NOT LIKE '%texasdefined-excluded'
    AND d.category IS DISTINCT FROM public.legacy_article_category_for_pillar(a.pillar_slug)
  ON CONFLICT (article_slug) DO UPDATE SET
    old_category = EXCLUDED.old_category,
    new_category = EXCLUDED.new_category,
    pillar_slug = EXCLUDED.pillar_slug,
    reclassified_at = EXCLUDED.reclassified_at;

  UPDATE public.daily_articles d
  SET category = public.legacy_article_category_for_pillar(a.pillar_slug)
  FROM public.article_pillar_assignments a
  WHERE a.article_slug = d.slug
    AND a.classifier_version NOT LIKE '%texasdefined-excluded'
    AND d.category IS DISTINCT FROM public.legacy_article_category_for_pillar(a.pillar_slug);

  GET DIAGNOSTICS changed_count = ROW_COUNT;
  RETURN changed_count;
END;
$$;

COMMENT ON FUNCTION public.sync_historical_article_categories_from_pillars() IS
  'Idempotently corrects historical visible categories from canonical article pillar assignments; General Texas News becomes the neutral Non-Political legacy display category.';

-- Correct all already-classified historical rows immediately when this
-- migration is applied.
SELECT public.sync_historical_article_categories_from_pillars();

-- The TypeScript classifier now uses content-pillars-v2 and deliberately
-- revisits older v1 assignments. Keep the visible category in sync shortly
-- after the existing :24 hourly classifier job runs.
DO $$
DECLARE existing_job_id bigint;
BEGIN
  SELECT jobid INTO existing_job_id FROM cron.job
  WHERE jobname = 'keep-tx-red-sync-historical-article-categories' LIMIT 1;
  IF existing_job_id IS NOT NULL THEN
    PERFORM cron.unschedule(existing_job_id);
  END IF;
END
$$;

SELECT cron.schedule(
  'keep-tx-red-sync-historical-article-categories',
  '29 * * * *',
  $$SELECT public.sync_historical_article_categories_from_pillars();$$
);

-- Ask the already-deployed deterministic classifier to perform its v2 pass.
-- pg_net is asynchronous; the :29 sync job above applies the resulting pillar
-- assignments to the visible category after classification completes.
SELECT net.http_post(
  url := 'https://keeptxred.com/api/public/hooks/classify-article-pillars',
  headers := '{"Content-Type":"application/json","Accept":"application/json"}'::jsonb,
  body := '{"source":"historical-category-backfill-v2"}'::jsonb,
  timeout_milliseconds := 120000
);

GRANT SELECT ON public.article_category_reclassification_log TO authenticated;
GRANT SELECT ON public.article_category_reclassification_log TO service_role;
