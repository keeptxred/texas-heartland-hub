-- Hyperlocal primary-source discovery layer.
-- Adds high-signal municipal agenda/news feeds and targeted local discovery
-- without turning the newsroom into an indiscriminate RSS firehose.

WITH sources(platform, source_name, source_url, rss_url, category, notes, enabled) AS (
  VALUES
    ('rss', 'Texas City Municipal Agendas — CivicEngage', 'https://www.texascitytx.gov/Rss.aspx', 'https://www.texascitytx.gov/RSSFeed.aspx?ModID=65&CID=All-0', 'City Government', 'Primary-source municipal agenda feed. Hyperlocal tier; editorial discovery only.', true),
    ('rss', 'Sinton City Council Agendas — CivicEngage', 'https://www.sintontexas.org/Rss.aspx', 'https://www.sintontexas.org/RSSFeed.aspx?ModID=65&CID=City-Council-2', 'City Government', 'Primary-source city council agenda feed for Coastal Bend coverage.', true),
    ('rss', 'Orange City Council Agendas — CivicEngage', 'https://orangetexas.gov/rss.aspx', 'https://orangetexas.gov/RSSFeed.aspx?ModID=65&CID=City-Council-2', 'City Government', 'Primary-source city council agenda feed for Southeast Texas coverage.', true),
    ('rss', 'Webster City Council Agendas — CivicEngage', 'https://www.webstertx.gov/rss.aspx', 'https://www.webstertx.gov/RSSFeed.aspx?ModID=65&CID=City-Council-Agenda-7', 'City Government', 'Primary-source city council agenda feed for Houston-area municipal coverage.', true),
    ('rss', 'Aubrey City Council Agendas — CivicEngage', 'https://aubreytx.gov/rss.aspx', 'https://aubreytx.gov/RSSFeed.aspx?ModID=65&CID=City-Council-2', 'City Government', 'Primary-source city council agenda feed for North Texas growth coverage.', true),
    ('rss', 'Paris Texas City Notices — CivicEngage', 'https://paristexas.gov/rss.aspx', 'https://paristexas.gov/RSSFeed.aspx?ModID=1&CID=City-Notices-4', 'City Government', 'Primary-source notices for Northeast Texas municipal developments.', true),
    ('rss', 'Galveston City Council Agendas — CivicEngage', 'https://galvestontx.gov/rss.aspx', 'https://galvestontx.gov/RSSFeed.aspx?ModID=65&CID=City-Council-6', 'City Government', 'Primary-source city council agenda feed for Gulf Coast coverage.', true),
    ('rss', 'Texas Hyperlocal Government — Daily Discovery', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28site%3Acommunityimpact.com+OR+site%3Akxan.com+OR+site%3Awfaa.com+OR+site%3AkhOU.com+OR+site%3Aksat.com+OR+site%3Akristv.com%29+%28city+council+OR+county+commissioners+OR+school+board+OR+public+health%29+Texas+when%3A2d&hl=en-US&gl=US&ceid=US%3Aen', 'Texas News', 'High-signal local-news discovery for municipal, school-board and public-health stories.', true),
    ('rss', 'Texas Hyperlocal Human Interest — Daily Discovery', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28site%3Acommunityimpact.com+OR+site%3Awfaa.com+OR+site%3Akxan.com+OR+site%3Aksat.com+OR+site%3Akristv.com%29+%28scholarship+OR+student+builds+OR+community+project+OR+local+history%29+Texas+when%3A5d&hl=en-US&gl=US&ceid=US%3Aen', 'Non-Political', 'TexasDefined-oriented hyperlocal human-interest and community discovery.', true),
    ('rss', 'Texas Mosquito and Local Health — Daily Discovery', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28mosquito+OR+encephalitis+OR+West+Nile+OR+vector+control%29+%28Corpus+Christi+OR+Kingsville+OR+Houston+OR+Dallas+OR+Austin+OR+San+Antonio+OR+Texas%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen', 'Texas News', 'Targeted local-health discovery for mosquito surveillance and vector-borne disease.', true)
)
INSERT INTO public.content_sources (platform, source_name, source_url, rss_url, category, notes, enabled)
SELECT s.*
FROM sources s
WHERE NOT EXISTS (
  SELECT 1
  FROM public.content_sources existing
  WHERE lower(existing.rss_url) = lower(s.rss_url)
     OR lower(existing.source_name) = lower(s.source_name)
);

UPDATE public.content_sources
SET enabled = true
WHERE source_name IN (
  'Texas City Municipal Agendas — CivicEngage',
  'Sinton City Council Agendas — CivicEngage',
  'Orange City Council Agendas — CivicEngage',
  'Webster City Council Agendas — CivicEngage',
  'Aubrey City Council Agendas — CivicEngage',
  'Paris Texas City Notices — CivicEngage',
  'Galveston City Council Agendas — CivicEngage',
  'Texas Hyperlocal Government — Daily Discovery',
  'Texas Hyperlocal Human Interest — Daily Discovery',
  'Texas Mosquito and Local Health — Daily Discovery'
);
