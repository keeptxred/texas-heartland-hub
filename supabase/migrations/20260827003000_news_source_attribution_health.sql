-- Attribute newsroom health to the configured discovery feed when available,
-- while preserving the actual publisher in texas_news_feed.source.

-- Historical direct/first-party rows already carry the configured source name in
-- `source`. Backfill those exact matches without guessing attribution for rows
-- discovered through aggregators such as Google News.
UPDATE public.texas_news_feed f
SET trend_source = f.source
WHERE (f.trend_source IS NULL OR btrim(f.trend_source) = '')
  AND EXISTS (
    SELECT 1
    FROM public.content_sources c
    WHERE c.enabled = true
      AND lower(c.source_name) = lower(f.source)
  );

CREATE OR REPLACE VIEW public.news_source_health
WITH (security_invoker = true)
AS
WITH enabled_sources AS (
  SELECT source_name, rss_url, category, enabled
  FROM public.content_sources
  WHERE enabled = true
    AND rss_url IS NOT NULL
),
recent_feed AS (
  SELECT
    coalesce(nullif(btrim(trend_source), ''), source) AS attribution_source,
    max(pub_date) AS latest_item_at,
    count(*) FILTER (WHERE pub_date >= now() - interval '24 hours') AS items_24h,
    count(*) FILTER (WHERE pub_date >= now() - interval '7 days') AS items_7d,
    count(*) FILTER (
      WHERE pub_date >= now() - interval '7 days'
        AND internal_slug IS NOT NULL
        AND btrim(internal_slug) <> ''
    ) AS covered_7d
  FROM public.texas_news_feed
  GROUP BY coalesce(nullif(btrim(trend_source), ''), source)
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
  ON lower(f.attribution_source) = lower(s.source_name)
ORDER BY
  CASE
    WHEN f.latest_item_at IS NULL THEN 0
    WHEN f.latest_item_at < now() - interval '7 days' THEN 1
    WHEN f.latest_item_at < now() - interval '48 hours' THEN 2
    ELSE 3
  END,
  s.source_name;

CREATE OR REPLACE VIEW public.hyperlocal_source_health
WITH (security_invoker = true)
AS
SELECT
  h.*,
  CASE
    WHEN h.health_status = 'never_seen' THEN 'check_feed_or_wait_for_first_item'
    WHEN h.health_status = 'stale' THEN 'repair_or_replace_source'
    WHEN h.health_status = 'quiet' THEN 'monitor'
    WHEN h.coverage_rate_7d < 10 AND h.items_7d >= 5 THEN 'review_relevance_or_routing'
    ELSE 'none'
  END AS recommended_action
FROM public.news_source_health h
WHERE
  lower(h.source_name) ~ '(city of|civic|hyperlocal|local government|community|mosquito|vector)'
  OR lower(coalesce(h.category, '')) ~ '(hyperlocal|local government|public-health|human-interest)'
ORDER BY
  CASE h.health_status
    WHEN 'never_seen' THEN 0
    WHEN 'stale' THEN 1
    WHEN 'quiet' THEN 2
    ELSE 3
  END,
  h.source_name;

GRANT SELECT ON public.news_source_health TO anon, authenticated, service_role;
GRANT SELECT ON public.hyperlocal_source_health TO anon, authenticated, service_role;

COMMENT ON VIEW public.news_source_health IS
  'Enabled newsroom sources with ingestion freshness and coverage attributed to trend_source (configured feed) when present, falling back to publisher source.';
COMMENT ON VIEW public.hyperlocal_source_health IS
  'Hyperlocal newsroom health based on configured discovery-feed attribution rather than third-party publisher names.';
