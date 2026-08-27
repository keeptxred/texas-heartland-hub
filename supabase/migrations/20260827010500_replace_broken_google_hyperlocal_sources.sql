-- Production fetch telemetry showed four consecutive HTTP 503s from the
-- Google-News-based hyperlocal discovery layer. Replace that fragile tier with
-- direct publisher RSS while retaining municipal CivicEngage primary sources.

UPDATE public.content_sources
SET
  enabled = false,
  notes = concat_ws(' ', nullif(notes, ''), 'Disabled 2026-08-26 after repeated HTTP 503 fetch failures; replaced by direct hyperlocal/local RSS sources.'),
  updated_at = now()
WHERE source_name IN (
  'Texas Hyperlocal Government — Daily Discovery',
  'Texas Hyperlocal Human Interest — Daily Discovery',
  'Texas Local Government — Google News',
  'Texas Mosquito and Local Health — Daily Discovery',
  'Texas Schools and Community — Daily Discovery'
);

WITH replacements(platform, source_name, source_url, rss_url, category, notes, enabled, source_reputation_score, source_quality_reason) AS (
  VALUES
    (
      'rss',
      'Community Impact — Texas Hyperlocal',
      'https://communityimpact.com/',
      'https://communityimpact.com/rss/',
      'Hyperlocal',
      'Direct statewide hyperlocal RSS covering Texas local government, education, healthcare, development, business and community news.',
      true,
      88,
      'Established Texas hyperlocal publisher; direct RSS avoids Google News dependency.'
    ),
    (
      'rss',
      'KRIS 6 — Corpus Christi Local',
      'https://www.kristv.com/news',
      'https://www.kristv.com/news.rss',
      'Hyperlocal',
      'Direct Corpus Christi and Coastal Bend local-news RSS, including health, schools, public safety and community reporting.',
      true,
      86,
      'Established Corpus Christi local television newsroom; direct RSS.'
    ),
    (
      'rss',
      'KZTV Action 10 — Corpus Christi Local',
      'https://www.kztv10.com/news/local-news',
      'https://www.kztv10.com/news/local-news.rss',
      'Hyperlocal',
      'Second direct Corpus Christi/Coastal Bend local-news RSS for independent local-source discovery and redundancy.',
      true,
      84,
      'Established Corpus Christi local television newsroom; direct RSS.'
    )
)
INSERT INTO public.content_sources (
  platform, source_name, source_url, rss_url, category, notes, enabled,
  source_reputation_score, source_quality_reason
)
SELECT r.*
FROM replacements r
WHERE NOT EXISTS (
  SELECT 1 FROM public.content_sources c
  WHERE lower(c.rss_url) = lower(r.rss_url)
);

-- If a replacement URL was already present but disabled, reactivate it and
-- normalize its source metadata rather than creating a duplicate.
UPDATE public.content_sources
SET enabled = true, updated_at = now()
WHERE lower(rss_url) IN (
  lower('https://communityimpact.com/rss/'),
  lower('https://www.kristv.com/news.rss'),
  lower('https://www.kztv10.com/news/local-news.rss')
);
