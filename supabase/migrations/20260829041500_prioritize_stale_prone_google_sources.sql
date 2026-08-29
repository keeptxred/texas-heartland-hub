-- Five Google discovery lanes repeatedly sat at the 2-hour source-health stale
-- boundary because 35 rotating feeds were checked 10 at a time. Route these
-- five through a distinct allowlisted relay URL so ingest-feeds treats them as
-- direct sources. That leaves 30 feeds in the existing 10-at-a-time rotation,
-- completing the rotating pool every 90 minutes without changing publication
-- or editorial safeguards.

update public.content_sources
set rss_url = 'https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay-priority?feed=google-airports-travel'
where source_name = 'Texas Airports TSA and Travel — Google News'
  and rss_url like '%/ktr-rss-relay?feed=google-airports-travel%';

update public.content_sources
set rss_url = 'https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay-priority?feed=google-dps-wanted'
where source_name = 'Texas DPS and Wanted Notices — Google News'
  and rss_url like '%/ktr-rss-relay?feed=google-dps-wanted%';

update public.content_sources
set rss_url = 'https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay-priority?feed=google-higher-education'
where source_name = 'Texas Higher Education and Campus Actions — Google News'
  and rss_url like '%/ktr-rss-relay?feed=google-higher-education%';

update public.content_sources
set rss_url = 'https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay-priority?feed=google-police-fire'
where source_name = 'Texas Police Sheriff and Fire Notices — Google News'
  and rss_url like '%/ktr-rss-relay?feed=google-police-fire%';

update public.content_sources
set rss_url = 'https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay-priority?feed=google-primary-workforce'
where source_name = 'Texas Workforce Primary Source — Google News'
  and rss_url like '%/ktr-rss-relay?feed=google-primary-workforce%';
