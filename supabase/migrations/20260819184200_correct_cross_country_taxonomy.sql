-- BULK_ARTICLE_MAINTENANCE
-- AdSense Phase 35: one ready cloud story was stored as generic Texas News
-- even though it is clearly Texas college sports. Keep the production data
-- correction reproducible in migration history.
UPDATE public.daily_articles
SET category = 'Sports',
    quality_flags = ARRAY(
      SELECT DISTINCT flag
      FROM unnest(
        coalesce(quality_flags, ARRAY[]::text[])
        || ARRAY['taxonomy_corrected']::text[]
      ) AS flag
    )
WHERE slug = '2026-08-18-texas-colleges-announce-2026-cross-country-schedules';
