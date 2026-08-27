-- De-queue exact government utility/navigation pages that were discovered by
-- primary-source Google queries before the shared low-value-title gate learned
-- these boilerplate titles. Preserve rows for audit/history; do not delete or
-- publish anything.
UPDATE public.texas_news_feed
SET
  ready_for_rewrite = false,
  routing_type = 'FACEBOOK_ONLY',
  viral_signals = coalesce(viral_signals, '{}'::jsonb)
    || jsonb_build_object(
      'low_value_utility_page', true,
      'auto_publish_eligible', false,
      'editorial_lane', 'SOCIAL_ONLY'
    )
WHERE trend_source IN (
  'Texas Transportation Primary Source — Google News',
  'Texas Workforce Primary Source — Google News',
  'Texas Grants and Workforce Investments — Google News'
)
AND lower(btrim(title)) IN (
  'map',
  'camera',
  'cameras',
  'incident',
  'incidents',
  'file viewing information',
  'contracting opportunities',
  'workforce policy letters & guidance',
  'workbook: bidder''s list',
  'texas transportation commission',
  '- texas workforce commission'
)
AND internal_slug IS NULL;
