-- All currently enabled Google News discovery feeds are persistently returning
-- HTTP 503 in production fetch telemetry. They are supplemental discovery only;
-- direct and first-party sources remain the newsroom backbone.
-- Disable, but do not delete, only Google News sources with at least five
-- consecutive recorded failures so this remediation is evidence-based and reversible.

UPDATE public.content_sources c
SET
  enabled = false,
  notes = concat_ws(
    ' ',
    nullif(c.notes, ''),
    'Disabled 2026-08-26 after at least five consecutive HTTP fetch failures in production source telemetry. Direct/first-party coverage remains enabled; source retained for future re-evaluation.'
  ),
  updated_at = now()
FROM public.news_source_fetch_state f
WHERE c.enabled = true
  AND c.rss_url ILIKE 'https://news.google.com/rss/search%'
  AND lower(f.source_name) = lower(c.source_name)
  AND coalesce(f.consecutive_failures, 0) >= 5;

COMMENT ON TABLE public.news_source_fetch_state IS
  'Latest ingestion fetch diagnostic per configured source, used to distinguish healthy, quiet, stale, and persistently failing newsroom sources.';
