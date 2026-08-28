-- Add a high-precision human-interest discovery lane. This query was probed
-- directly on 2026-08-28 and returned 10/10 items within three days, led by
-- Texas doorbell-camera, wildlife-camera, and unusual roadside footage.
-- Publication/scoring safeguards remain unchanged.

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
  'Texas Human Interest — Caught on Camera',
  'https://news.google.com/',
  'Non-Political',
  'High-precision Texas visual human-interest discovery: caught-on-camera incidents, unusual deliveries, wildlife footage, and memorable local scenes.',
  true,
  'https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay?feed=google-human-interest-camera&transport=relay'
where not exists (
  select 1 from public.content_sources
  where source_name = 'Texas Human Interest — Caught on Camera'
);

update public.content_sources
set
  platform = 'rss',
  source_url = 'https://news.google.com/',
  category = 'Non-Political',
  notes = 'High-precision Texas visual human-interest discovery: caught-on-camera incidents, unusual deliveries, wildlife footage, and memorable local scenes.',
  enabled = true,
  rss_url = 'https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay?feed=google-human-interest-camera&transport=relay',
  updated_at = now()
where source_name = 'Texas Human Interest — Caught on Camera';
