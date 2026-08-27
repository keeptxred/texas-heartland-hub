-- Expand Texas story discovery based on recurring high-value story archetypes
-- observed in competing Texas roundup products. This is discovery-only: the
-- existing ingestion, Texas-relevance, source-quality, clustering, fact-
-- verification, and publication-readiness safeguards remain authoritative.
--
-- The goal is to independently find the same underlying public events from
-- original/primary sources and reputable local reporting, not to ingest or
-- imitate any competitor's copy.

WITH sources(platform, source_name, source_url, rss_url, category, notes, enabled) AS (
  VALUES
    ('rss', 'Texas Executive Actions — Google News', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28site%3Agov.texas.gov+OR+%22Governor+Abbott%22+appointment+OR+%22Governor+Abbott%22+directs+OR+%22Governor+Abbott%22+grant%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen', 'Politics', 'Governor appointments, directives, grants, disaster actions, boards, commissions, and executive announcements.', true),
    ('rss', 'Texas Attorney General Actions — Google News', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28site%3Atexasattorneygeneral.gov+OR+%22Texas+Attorney+General%22+settlement+OR+%22Texas+Attorney+General%22+lawsuit+OR+%22Texas+Attorney+General%22+investigation%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen', 'Politics', 'Attorney General settlements, lawsuits, investigations, consumer actions, and court filings.', true),
    ('rss', 'Texas DPS and Wanted Notices — Google News', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28site%3Adps.texas.gov+OR+%22Texas+10+Most+Wanted%22+OR+%22Texas+DPS%22+reward+OR+%22Texas+DPS%22+arrest%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen', 'Local', 'DPS arrests, fugitive captures, rewards, Amber/Silver alerts, public-safety notices, and statewide enforcement items.', true),
    ('rss', 'Texas City and County Decisions — Google News', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28%22city+council%22+Texas+settlement+OR+%22city+council%22+Texas+approves+OR+%22commissioners+court%22+Texas+approves+OR+%22county+clerk%22+Texas+OR+%22county+judge%22+Texas%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen', 'Local', 'Council and commissioners-court votes, settlements, salaries, local appointments, budgets, and unusual civic decisions.', true),
    ('rss', 'Texas Police Sheriff and Fire Notices — Google News', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28%22police+department%22+Texas+arrest+OR+%22sheriff%27s+office%22+Texas+arrest+OR+%22fire+department%22+Texas+evacuation+OR+%22fire+marshal%22+Texas+OR+daycare+Texas+arrest%29+when%3A2d&hl=en-US&gl=US&ceid=US%3Aen', 'Local', 'Hyperlocal police, sheriff, fire, evacuation, child-safety, and public-safety stories that may not rise to statewide feeds.', true),
    ('rss', 'Texas Courts and Judicial Appointments — Google News', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Texas+federal+judge+blocks+OR+Texas+judge+rules+OR+Texas+court+unseal+OR+Texas+district+court+appointment+OR+Texas+judicial+appointment%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen', 'Politics', 'Federal/state rulings, injunctions, unsealing motions, judicial appointments, and court developments.', true),
    ('rss', 'Texas Higher Education and Campus Actions — Google News', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28%22Texas+Higher+Education+Coordinating+Board%22+OR+Texas+university+grant+OR+Texas+university+appointment+OR+Texas+college+program+OR+Texas+campus+expansion%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen', 'Education', 'Higher-education directives, new programs, grants, appointments, research, and campus expansion.', true),
    ('rss', 'Texas Corporate Partnerships and Expansions — Google News', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Texas+%22exclusive+partner%22+OR+Texas+%22corporate+headquarters%22+OR+Texas+%22new+plant%22+OR+Texas+%22manufacturing+facility%22+OR+Texas+%22jobs+by+2030%22+OR+Texas+company+expansion%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen', 'Business', 'Corporate partnerships, headquarters moves, manufacturing plants, major hiring plans, and regional expansions.', true),
    ('rss', 'Texas Grants and Workforce Investments — Google News', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28site%3Atwc.texas.gov+OR+Texas+workforce+grant+OR+Texas+training+grant+OR+Texas+economic+development+grant+OR+Texas+skills+grant%29+when%3A4d&hl=en-US&gl=US&ceid=US%3Aen', 'Business', 'Workforce Commission grants, training investments, skills programs, and regional workforce development.', true),
    ('rss', 'Texas Property and Records Alerts — Google News', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Texas+property+fraud+alert+OR+Texas+deed+fraud+OR+Texas+county+clerk+property+alert+OR+Texas+property+records+alert%29+when%3A7d&hl=en-US&gl=US&ceid=US%3Aen', 'Local', 'County property-recording alerts, deed-fraud prevention, appraisal, and homeowner-protection services.', true),
    ('rss', 'Texas Zoos Wildlife and Conservation — Google News', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Texas+zoo+joey+OR+Texas+zoo+baby+OR+Texas+zoo+birth+OR+Texas+wildlife+release+OR+Texas+endangered+animal+OR+Texas+conservation+success%29+when%3A5d&hl=en-US&gl=US&ceid=US%3Aen', 'Non-Political', 'Zoo births, wildlife milestones, conservation successes, rare animals, and photo-friendly community stories.', true),
    ('rss', 'Texas Libraries Museums and Community Grants — Google News', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Texas+library+%22million%22+grant+OR+Texas+library+donation+OR+Texas+museum+grant+OR+Texas+community+foundation+gift+OR+Texas+cultural+grant%29+when%3A7d&hl=en-US&gl=US&ceid=US%3Aen', 'Non-Political', 'Library, museum, cultural, and community-foundation gifts and capital projects.', true),
    ('rss', 'Texas Awards Contests and Recognition — Google News', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Texas+%22named+best%22+OR+Texas+%22wins+contest%22+OR+Texas+%22fan-voted%22+OR+Texas+%22cutest%22+OR+Texas+award+winner%29+when%3A5d&hl=en-US&gl=US&ceid=US%3Aen', 'Non-Political', 'State and national awards, reader/fan-voted contests, rankings, and recognitions with a Texas hook.', true),
    ('rss', 'Texas Sports Recruiting and Partnerships — Google News', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Texas+Tech+commitment+OR+Texas+Longhorns+commitment+OR+Texas+A%26M+commitment+OR+Baylor+commitment+OR+SMU+commitment+OR+TCU+commitment+OR+Texas+sports+%22exclusive+partner%22%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen', 'Sports', 'College recruiting commitments, team partnerships, sponsorships, roster moves, and program milestones.', true),
    ('rss', 'Texas Sports Records and Honors — Google News', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Texas+team+clinches+OR+Texas+athlete+record+OR+Texas+school+tradition+award+OR+Texas+NCAA+penalty+OR+Texas+sports+milestone%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen', 'Sports', 'Playoff clinches, records, NCAA actions, traditions, awards, and Texas-specific sports milestones.', true),
    ('rss', 'Texas Airports TSA and Travel — Google News', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Texas+airport+TSA+OR+DFW+TSA+OR+Houston+airport+TSA+OR+Texas+airport+award+OR+Texas+airport+new+route%29+when%3A5d&hl=en-US&gl=US&ceid=US%3Aen', 'Non-Political', 'TSA notices, airport awards, unusual airport stories, route announcements, and travel developments.', true),
    ('rss', 'Texas Local Oddities and Human Interest — Google News', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Texas+robot+sidewalk+OR+Texas+unusual+city+project+OR+Texas+local+oddity+OR+Texas+community+milestone+OR+Texas+unique+tradition%29+when%3A5d&hl=en-US&gl=US&ceid=US%3Aen', 'Non-Political', 'Civic oddities, unusual municipal projects, local traditions, human-interest items, and memorable community stories.', true)
)
INSERT INTO public.content_sources (platform, source_name, source_url, rss_url, category, notes, enabled)
SELECT s.*
FROM sources s
WHERE NOT EXISTS (
  SELECT 1
  FROM public.content_sources existing
  WHERE lower(existing.rss_url) = lower(s.rss_url)
);

-- If any of these rows were created by a partial/manual deployment, normalize
-- them back to enabled rather than creating duplicates.
UPDATE public.content_sources
SET enabled = true
WHERE source_name IN (
  'Texas Executive Actions — Google News',
  'Texas Attorney General Actions — Google News',
  'Texas DPS and Wanted Notices — Google News',
  'Texas City and County Decisions — Google News',
  'Texas Police Sheriff and Fire Notices — Google News',
  'Texas Courts and Judicial Appointments — Google News',
  'Texas Higher Education and Campus Actions — Google News',
  'Texas Corporate Partnerships and Expansions — Google News',
  'Texas Grants and Workforce Investments — Google News',
  'Texas Property and Records Alerts — Google News',
  'Texas Zoos Wildlife and Conservation — Google News',
  'Texas Libraries Museums and Community Grants — Google News',
  'Texas Awards Contests and Recognition — Google News',
  'Texas Sports Recruiting and Partnerships — Google News',
  'Texas Sports Records and Honors — Google News',
  'Texas Airports TSA and Travel — Google News',
  'Texas Local Oddities and Human Interest — Google News'
);
