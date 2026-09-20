-- BULK_ARTICLE_MAINTENANCE
-- Preserve reviewed taxonomy for two published stories that were being
-- overwritten by the legacy article-pillar synchronization job.

UPDATE public.daily_articles
SET
  category = 'Sports',
  quality_flags = ARRAY(
    SELECT DISTINCT flag
    FROM unnest(
      coalesce(quality_flags, '{}'::text[])
      || ARRAY['taxonomy_locked']::text[]
    ) AS flag
  )
WHERE slug = '2026-09-06-texas-a-m-dominates-missouri-state-in-season-opener'
  AND (
    category IS DISTINCT FROM 'Sports'
    OR NOT ('taxonomy_locked' = ANY(coalesce(quality_flags, '{}'::text[])))
  );

UPDATE public.article_pillar_assignments
SET
  pillar_slug = NULL,
  classifier_version = 'manual-taxonomy-review-20260912',
  classified_at = now()
WHERE article_slug = '2026-09-06-texas-a-m-dominates-missouri-state-in-season-opener'
  AND (
    pillar_slug IS NOT NULL
    OR classifier_version IS DISTINCT FROM 'manual-taxonomy-review-20260912'
  );

UPDATE public.daily_articles
SET
  category = 'Government',
  quality_flags = ARRAY(
    SELECT DISTINCT flag
    FROM unnest(
      coalesce(quality_flags, '{}'::text[])
      || ARRAY['taxonomy_locked']::text[]
    ) AS flag
  )
WHERE slug = '2026-09-11-texas-needs-more-foster-care-spending-transparency-state-report-says'
  AND (
    category IS DISTINCT FROM 'Government'
    OR NOT ('taxonomy_locked' = ANY(coalesce(quality_flags, '{}'::text[])))
  );

UPDATE public.article_pillar_assignments
SET
  pillar_slug = 'texas-politics-government',
  classifier_version = 'manual-taxonomy-review-20260912',
  classified_at = now()
WHERE article_slug = '2026-09-11-texas-needs-more-foster-care-spending-transparency-state-report-says'
  AND (
    pillar_slug IS DISTINCT FROM 'texas-politics-government'
    OR classifier_version IS DISTINCT FROM 'manual-taxonomy-review-20260912'
  );
