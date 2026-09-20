-- Restore direct first-party Texas government feeds that were stranded by a
-- duplicate migration-version collision on 20260827194000.
--
-- This migration is intentionally idempotent. It restores the original source
-- definitions without changing publication, relevance, source-quality,
-- clustering, verification, or editorial safeguards.

WITH sources(platform, source_name, source_url, rss_url, category, notes, enabled) AS (
  VALUES
    (
      'rss',
      'Texas Attorney General — Direct News Releases',
      'https://www.texasattorneygeneral.gov/news',
      'https://www2.texasattorneygeneral.gov/feeds/feeds.php?feed=pr',
      'Politics',
      'Official Texas Attorney General press-release RSS feed. Direct every-run source for settlements, lawsuits, investigations, consumer actions, opinions-related announcements, and enforcement news.',
      true
    ),
    (
      'rss',
      'Texas DPS — Direct Most Wanted RSS',
      'https://www.dps.texas.gov/news',
      'https://www.dps.texas.gov/rss/most-wanted.xml',
      'Local',
      'Official Texas Department of Public Safety RSS feed linked from the DPS press-release surface. Direct every-run source for Most Wanted, fugitive, reward, capture, and related public-safety notices.',
      true
    )
)
INSERT INTO public.content_sources (platform, source_name, source_url, rss_url, category, notes, enabled)
SELECT s.*
FROM sources s
WHERE NOT EXISTS (
  SELECT 1
  FROM public.content_sources existing
  WHERE lower(existing.rss_url) = lower(s.rss_url)
     OR existing.source_name = s.source_name
);

UPDATE public.content_sources AS existing
SET
  platform = s.platform,
  source_url = s.source_url,
  rss_url = s.rss_url,
  category = s.category,
  notes = s.notes,
  enabled = true,
  updated_at = now()
FROM sources s
WHERE existing.source_name = s.source_name;
