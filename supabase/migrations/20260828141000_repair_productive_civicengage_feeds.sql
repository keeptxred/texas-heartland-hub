-- Replace persistently empty CivicEngage source URLs only where the city's
-- own current RSS directory exposes a demonstrably productive primary-source
-- feed. Downstream Texas relevance, scoring, review, and publication gates are
-- unchanged.

update public.content_sources
set
  source_name = 'Webster Municipal Agendas — CivicEngage',
  rss_url = 'https://www.webstertx.gov/RSSFeed.aspx?CID=All-0&ModID=65'
where source_name = 'Webster City Council Agendas — CivicEngage'
  and rss_url = 'https://www.webstertx.gov/RSSFeed.aspx?ModID=65&CID=City-Council-Agenda-7';

update public.content_sources
set
  source_name = 'Sinton Municipal Agendas — CivicEngage',
  rss_url = 'https://www.sintontexas.org/RSSFeed.aspx?CID=All-0&ModID=65'
where source_name = 'Sinton City Council Agendas — CivicEngage'
  and rss_url = 'https://www.sintontexas.org/RSSFeed.aspx?ModID=65&CID=City-Council-2';

update public.content_sources
set
  source_name = 'Paris Municipal News — CivicEngage',
  rss_url = 'https://paristexas.gov/RSSFeed.aspx?CID=All-newsflash.xml&ModID=1'
where source_name = 'Paris Texas City Notices — CivicEngage'
  and rss_url = 'https://paristexas.gov/RSSFeed.aspx?ModID=1&CID=City-Notices-4';

update public.content_sources
set
  source_name = 'Texas City Municipal News — CivicEngage',
  rss_url = 'https://texascitytx.gov/RSSFeed.aspx?CID=All-newsflash.xml&ModID=1'
where source_name = 'Texas City Municipal Agendas — CivicEngage'
  and rss_url = 'https://www.texascitytx.gov/RSSFeed.aspx?ModID=65&CID=All-0';

update public.content_sources
set
  source_name = 'Galveston Municipal News — CivicEngage',
  rss_url = 'https://www.galvestontx.gov/RSSFeed.aspx?CID=All-newsflash.xml&ModID=1'
where source_name = 'Galveston City Council Agendas — CivicEngage'
  and rss_url = 'https://galvestontx.gov/RSSFeed.aspx?ModID=65&CID=City-Council-6';
