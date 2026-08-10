-- Show whether each enabled newsroom source is actually producing recent feed items.
-- This gives Admin a deterministic way to distinguish a broken source from a
-- downstream scoring or publishing problem without adding a paid service.

CREATE OR REPLACE VIEW public.news_source_health AS
WITH enabled_sources AS (
  SELECT
    source_name,
    rss_url,
    category,
    enabled
  FROM public.content_sources
  WHERE enabled = true
    AND rss_url IS NOT NULL
),
recent_feed AS (
  SELECT
    source,
    max(pub_date) AS latest_item_at,
    count(*) FILTER (WHERE pub_date >= now() - interval '24 hours') AS items_24h,
    count(*) FILTER (WHERE pub_date >= now() - interval '7 days') AS items_7d,
    count(*) FILTER (
      WHERE pub_date >= now() - interval '7 days'
        AND internal_slug IS NOT NULL
        AND btrim(internal_slug) <> ''
    ) AS covered_7d
  FROM public.texas_news_feed
  GROUP BY source
)
SELECT
  s.source_name,
  s.rss_url,
  s.category,
  f.latest_item_at,
  coalesce(f.items_24h, 0) AS items_24h,
  coalesce(f.items_7d, 0) AS items_7d,
  coalesce(f.covered_7d, 0) AS covered_7d,
  CASE
    WHEN f.latest_item_at IS NULL THEN 'never_seen'
    WHEN f.latest_item_at < now() - interval '7 days' THEN 'stale'
    WHEN f.latest_item_at < now() - interval '48 hours' THEN 'quiet'
    ELSE 'healthy'
  END AS health_status,
  CASE
    WHEN coalesce(f.items_7d, 0) = 0 THEN 0
    ELSE round((coalesce(f.covered_7d, 0)::numeric / f.items_7d::numeric) * 100, 1)
  END AS coverage_rate_7d
FROM enabled_sources s
LEFT JOIN recent_feed f
  ON lower(f.source) = lower(s.source_name)
ORDER BY
  CASE
    WHEN f.latest_item_at IS NULL THEN 0
    WHEN f.latest_item_at < now() - interval '7 days' THEN 1
    WHEN f.latest_item_at < now() - interval '48 hours' THEN 2
    ELSE 3
  END,
  s.source_name;

COMMENT ON VIEW public.news_source_health IS
  'Enabled newsroom RSS sources with recent ingestion volume, freshness, and native-article coverage rate.';

GRANT SELECT ON public.news_source_health TO anon;
GRANT SELECT ON public.news_source_health TO authenticated;
GRANT SELECT ON public.news_source_health TO service_role;
