-- Add a first-party Texas State Library discovery source for library-development
-- news, grants, programs, and community-library activity. TSLAC explicitly
-- publishes this RSS endpoint for Library Developments.
--
-- Keep the source review-only (60) so adding a new discovery path cannot confer
-- automatic publication authority. Existing relevance, editorial, clustering,
-- source verification, and publication safeguards remain unchanged.

WITH source_row AS (
  SELECT
    'rss'::text AS platform,
    'Texas State Library — Library Developments'::text AS source_name,
    'https://www.tsl.texas.gov/ld/librarydevelopments/'::text AS source_url,
    'https://www.tsl.texas.gov/ld/librarydevelopments/?feed=rss2'::text AS rss_url,
    'Non-Political'::text AS category,
    'Official Texas State Library and Archives Commission Library Development RSS feed; first-party discovery for library grants, programs, funding, services, and community-library developments.'::text AS notes
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
  'Official Texas library-agency source; review-visible only (below 65 automatic-source threshold)',
  true
FROM source_row s
WHERE NOT EXISTS (
  SELECT 1
  FROM public.content_sources existing
  WHERE lower(existing.rss_url) = lower(s.rss_url)
     OR existing.source_name = s.source_name
);

UPDATE public.content_sources
SET
  rss_url = 'https://www.tsl.texas.gov/ld/librarydevelopments/?feed=rss2',
  source_reputation_score = 60,
  source_quality_reason = 'Official Texas library-agency source; review-visible only (below 65 automatic-source threshold)',
  enabled = true,
  updated_at = now()
WHERE source_name = 'Texas State Library — Library Developments';
