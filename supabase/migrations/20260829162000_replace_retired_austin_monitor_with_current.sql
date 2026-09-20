-- Austin Monitor stopped publishing on October 28, 2025 and now serves as an
-- archive. Replace its stale enabled RSS source with the active successor,
-- Austin Current, using Austin Current's direct first-party RSS feed.
--
-- Keep Austin Current at reputation 60: review-visible, but below the 65
-- automatic-source threshold. No publication or editorial gates are changed.

UPDATE public.content_sources
SET
  enabled = false,
  notes = trim(both from coalesce(notes, '') || ' Retired: Austin Monitor stopped publishing October 28, 2025 and is now an archive; active successor is Austin Current.'),
  updated_at = now()
WHERE source_name = 'Austin Monitor';

WITH source_row AS (
  SELECT
    'rss'::text AS platform,
    'Austin Current — Direct RSS'::text AS source_name,
    'https://austincurrent.org/'::text AS source_url,
    'https://austincurrent.org/feed/'::text AS rss_url,
    'Austin'::text AS category,
    'Active successor to the retired Austin Monitor; direct first-party RSS for Austin government, education, growth/development, community, public-safety, and local accountability reporting.'::text AS notes
)
INSERT INTO public.content_sources (
  platform,
  source_name,
  source_url,
  rss_url,
  category,
  notes,
  source_reputation_score,
  source_quality_reason,
  enabled
)
SELECT
  s.platform,
  s.source_name,
  s.source_url,
  s.rss_url,
  s.category,
  s.notes,
  60,
  'Active Austin local newsroom and Austin Monitor successor; direct first-party RSS is review-visible only (below 65 automatic-source threshold)',
  true
FROM source_row s
WHERE NOT EXISTS (
  SELECT 1
  FROM public.content_sources existing
  WHERE existing.source_name = s.source_name
     OR lower(existing.rss_url) = lower(s.rss_url)
);

UPDATE public.content_sources
SET
  platform = 'rss',
  source_url = 'https://austincurrent.org/',
  rss_url = 'https://austincurrent.org/feed/',
  category = 'Austin',
  notes = 'Active successor to the retired Austin Monitor; direct first-party RSS for Austin government, education, growth/development, community, public-safety, and local accountability reporting.',
  source_reputation_score = 60,
  source_quality_reason = 'Active Austin local newsroom and Austin Monitor successor; direct first-party RSS is review-visible only (below 65 automatic-source threshold)',
  enabled = true,
  updated_at = now()
WHERE source_name = 'Austin Current — Direct RSS';
