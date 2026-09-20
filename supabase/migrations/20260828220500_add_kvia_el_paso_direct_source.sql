-- Add a dependable direct El Paso local-news feed so West Texas coverage does
-- not depend on rotating Google discovery alone. The category feed was probed
-- on 2026-08-28 at HTTP 200 with 50 items; 18 were published within three days.
-- Existing relevance/routing/scoring/publication safeguards remain unchanged.

insert into public.content_sources (
  platform,
  source_name,
  source_url,
  category,
  notes,
  enabled,
  rss_url
)
select
  'rss',
  'KVIA ABC-7 — El Paso Local',
  'https://kvia.com/news/el-paso/',
  'Local',
  'Direct KVIA El Paso category RSS for dependable El Paso and far-West-Texas local coverage.',
  true,
  'https://kvia.com/news/el-paso/feed/'
where not exists (
  select 1 from public.content_sources
  where source_name = 'KVIA ABC-7 — El Paso Local'
);

update public.content_sources
set
  platform = 'rss',
  source_url = 'https://kvia.com/news/el-paso/',
  category = 'Local',
  notes = 'Direct KVIA El Paso category RSS for dependable El Paso and far-West-Texas local coverage.',
  enabled = true,
  rss_url = 'https://kvia.com/news/el-paso/feed/',
  updated_at = now()
where source_name = 'KVIA ABC-7 — El Paso Local';
