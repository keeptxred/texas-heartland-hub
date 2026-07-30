-- Seed reliable direct Texas news RSS sources for the newsroom ingestion pipeline.
-- These feeds are loaded automatically by ingest-feeds.ts through content_sources.

INSERT INTO public.content_sources (
  platform,
  source_name,
  source_url,
  rss_url,
  category,
  notes,
  enabled
)
SELECT
  'rss',
  'The Texas Tribune',
  'https://www.texastribune.org/',
  'https://feeds.texastribune.org/feeds/main/',
  'Politics',
  'Primary statewide Texas news feed used by Content Opportunities and Viral Radar.',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.content_sources
  WHERE lower(rss_url) = lower('https://feeds.texastribune.org/feeds/main/')
);

INSERT INTO public.content_sources (
  platform,
  source_name,
  source_url,
  rss_url,
  category,
  notes,
  enabled
)
SELECT
  'rss',
  'The Texas Tribune — Politics',
  'https://www.texastribune.org/topics/politics/',
  'https://www.texastribune.org/topics/politics/feed',
  'Politics',
  'Texas politics topic feed.',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.content_sources
  WHERE lower(rss_url) = lower('https://www.texastribune.org/topics/politics/feed')
);

INSERT INTO public.content_sources (
  platform,
  source_name,
  source_url,
  rss_url,
  category,
  notes,
  enabled
)
SELECT
  'rss',
  'The Texas Tribune — Elections',
  'https://www.texastribune.org/topics/elections/',
  'https://www.texastribune.org/topics/elections/feed',
  'Elections',
  'Texas elections topic feed.',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.content_sources
  WHERE lower(rss_url) = lower('https://www.texastribune.org/topics/elections/feed')
);

INSERT INTO public.content_sources (
  platform,
  source_name,
  source_url,
  rss_url,
  category,
  notes,
  enabled
)
SELECT
  'rss',
  'The Texas Tribune — Border',
  'https://www.texastribune.org/topics/border/',
  'https://www.texastribune.org/topics/border/feed',
  'Politics',
  'Texas border topic feed.',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.content_sources
  WHERE lower(rss_url) = lower('https://www.texastribune.org/topics/border/feed')
);

INSERT INTO public.content_sources (
  platform,
  source_name,
  source_url,
  rss_url,
  category,
  notes,
  enabled
)
SELECT
  'rss',
  'The Texas Tribune — Energy',
  'https://www.texastribune.org/topics/energy/',
  'https://www.texastribune.org/topics/energy/feed',
  'Business',
  'Texas energy and grid topic feed.',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.content_sources
  WHERE lower(rss_url) = lower('https://www.texastribune.org/topics/energy/feed')
);
