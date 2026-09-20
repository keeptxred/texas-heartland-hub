-- The zero-yield Mavericks and Spurs HTML scrapers were retired after verified
-- replacement coverage went live. Their legacy content_sources rows have no
-- rss_url and must not remain enabled, otherwise source-health reconciliation
-- can match stale fetch-state rows by name and report false quiet sources.

update public.content_sources
set enabled = false
where source_name in ('Dallas Mavericks', 'San Antonio Spurs')
  and rss_url is null
  and enabled = true;

comment on table public.content_sources is
  'Newsroom source registry; retired source placeholders with no fetch URL must remain disabled so health telemetry reflects active fetch paths only.';
