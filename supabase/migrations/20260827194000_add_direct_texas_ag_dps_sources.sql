-- Add direct first-party feeds for two high-value Texas government sources.
-- These URLs are non-Google RSS feeds, so ingest-feeds.ts checks them every run
-- instead of placing them in the rotating Google News supplemental window.
-- Existing Texas relevance, source reputation, clustering, fact verification,
-- publication readiness, and publication safeguards remain unchanged.

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
);

UPDATE public.content_sources
SET enabled = true
WHERE source_name IN (
  'Texas Attorney General — Direct News Releases',
  'Texas DPS — Direct Most Wanted RSS'
);
