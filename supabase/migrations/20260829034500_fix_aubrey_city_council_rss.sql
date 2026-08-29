-- Aubrey's current official CivicEngage RSS directory maps City Council to
-- CID=City-Council-4. The previously configured CID=City-Council-2 returns an
-- empty feed for the wrong category. Keep the source enabled and preserve all
-- downstream scoring, review, and publication safeguards.

update public.content_sources
set rss_url = 'https://www.aubreytx.gov/RSSFeed.aspx?CID=City-Council-4&ModID=65'
where source_name = 'Aubrey City Council Agendas — CivicEngage'
  and rss_url = 'https://aubreytx.gov/RSSFeed.aspx?ModID=65&CID=City-Council-2';
