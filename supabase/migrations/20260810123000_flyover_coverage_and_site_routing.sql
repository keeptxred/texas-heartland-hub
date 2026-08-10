-- Flyover coverage contract: broaden discovery and route incoming Texas stories
-- to the publication where they fit best. The shared Supabase backend remains
-- the discovery source; KeepTXRed owns hard news/politics/business/sports while
-- TexasDefined owns lifestyle/history/outdoors/culture/human-interest.

ALTER TABLE public.texas_news_feed
  ADD COLUMN IF NOT EXISTS target_site text,
  ADD COLUMN IF NOT EXISTS target_section text;

CREATE OR REPLACE FUNCTION public.route_texas_story_to_site()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  haystack text := lower(coalesce(NEW.title,'') || ' ' || coalesce(NEW.description,'') || ' ' || coalesce(NEW.source,''));
BEGIN
  IF haystack ~ '(court|appeals|attorney general|lawsuit|judge|gun ban|firearm|police|sheriff|game warden|shot|shooting|killed|dies|died|fentanyl|child endangerment|virus|encephalitis|crash|fatal|city council|mayor|legislation|school district|insurance|contract extension|roster|selected infielder|injured list|acquire|mavericks|cowboys|rangers|astros|texans|spurs|stars|business|store|remodel|acquisition|buy|layoff|restaurant|doordash|corporate campus|redevelopment)' THEN
    NEW.target_site := 'keeptxred';
    NEW.target_section := CASE
      WHEN haystack ~ '(mavericks|cowboys|rangers|astros|texans|spurs|stars|athlete|sprinter|championship|contract extension|roster|infielder|injured list)' THEN 'Sports'
      WHEN haystack ~ '(business|store|remodel|acquisition|buy|restaurant|doordash|corporate campus|redevelopment|layoff)' THEN 'Business'
      WHEN haystack ~ '(court|appeals|attorney general|lawsuit|judge|gun ban|firearm|city council|mayor|legislation)' THEN 'Politics'
      ELSE 'Texas News'
    END;
  ELSIF haystack ~ '(canyon lake|reservoir|lake full|state park|nature center|wildlife|alligator|outdoors|river|trail|camping|county.*born in texas|born in texas|texas history|on this day|nueces|historic|lego|replica|human interest|scholarship|wheelchair|13-year-old|13 year old|museum|culture|small town|travel|attraction)' THEN
    NEW.target_site := 'texasdefined';
    NEW.target_section := CASE
      WHEN haystack ~ '(canyon lake|reservoir|lake full|state park|nature center|wildlife|alligator|outdoors|river|trail|camping)' THEN 'Explore'
      WHEN haystack ~ '(texas history|on this day|nueces|historic)' THEN 'History'
      ELSE 'Texas Life'
    END;
  ELSE
    NEW.target_site := 'keeptxred';
    NEW.target_section := 'Texas News';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_route_texas_story_to_site ON public.texas_news_feed;
CREATE TRIGGER trg_route_texas_story_to_site
BEFORE INSERT OR UPDATE OF title, description, source
ON public.texas_news_feed
FOR EACH ROW
EXECUTE FUNCTION public.route_texas_story_to_site();

UPDATE public.texas_news_feed
SET title = title
WHERE target_site IS NULL;

CREATE OR REPLACE VIEW public.keeptxred_story_queue AS
SELECT *
FROM public.texas_news_feed
WHERE target_site = 'keeptxred';

CREATE OR REPLACE VIEW public.texasdefined_story_queue AS
SELECT *
FROM public.texas_news_feed
WHERE target_site = 'texasdefined';

WITH sources(platform, source_name, source_url, rss_url, category, notes, enabled) AS (
  VALUES
    ('rss', 'Texas Courts and Legal — Daily Discovery', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Texas+court+OR+Texas+appeals+court+OR+Texas+lawsuit+OR+Texas+attorney+general+OR+Texas+gun+ban%29+when%3A2d&hl=en-US&gl=US&ceid=US%3Aen', 'Politics', 'Daily court, rights, litigation and attorney-general coverage.', true),
    ('rss', 'Texas Public Safety — Daily Discovery', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Texas+police+OR+Texas+sheriff+OR+Texas+game+wardens+OR+Texas+child+endangerment+OR+Texas+fatal+crash%29+when%3A2d&hl=en-US&gl=US&ceid=US%3Aen', 'Texas News', 'Crime, public safety, game-warden enforcement and serious local incidents.', true),
    ('rss', 'Texas Health — Daily Discovery', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Texas+mosquito+virus+OR+Texas+encephalitis+OR+Texas+public+health+OR+Texas+hospital%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen', 'Texas News', 'Public-health developments that affect Texas communities.', true),
    ('rss', 'Texas Schools and Community — Daily Discovery', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Texas+school+district+OR+Texas+school+scholarship+OR+Texas+campus+flood+OR+Texas+student%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen', 'Texas News', 'School districts, campuses, scholarships and community-impact education stories.', true),
    ('rss', 'Texas Outdoors and Water — Daily Discovery', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Texas+lake+OR+Texas+reservoir+OR+Texas+state+park+OR+Texas+wildlife+OR+Texas+nature+center%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen', 'Non-Political', 'Lakes, reservoirs, parks, wildlife and outdoor developments for TexasDefined.', true),
    ('rss', 'Texas Human Interest — Daily Discovery', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Texas+scholarship+OR+Texas+LEGO+OR+Texas+wheelchair+OR+Texas+teen+builds+OR+Texas+community+story%29+when%3A5d&hl=en-US&gl=US&ceid=US%3Aen', 'Non-Political', 'Distinctive community and human-interest stories for TexasDefined.', true),
    ('rss', 'Texas History and Identity — Daily Discovery', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Texas+history+OR+Texas+anniversary+OR+%22born+in+Texas%22+OR+Texas+counties+ranking%29+when%3A7d&hl=en-US&gl=US&ceid=US%3Aen', 'Non-Political', 'History, identity, demographics and Texas culture for TexasDefined.', true),
    ('rss', 'Texas Business Local — Daily Discovery', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Texas+store+remodel+OR+Texas+acquisition+OR+Texas+restaurant+OR+Texas+corporate+campus+OR+Texas+redevelopment%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen', 'Business', 'Local expansions, acquisitions, restaurants, redevelopment and corporate investment.', true),
    ('rss', 'Texas Pro Sports — Daily Discovery', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Dallas+Mavericks+OR+Dallas+Cowboys+OR+Texas+Rangers+OR+Houston+Astros+OR+Houston+Texans+OR+San+Antonio+Spurs%29+when%3A2d&hl=en-US&gl=US&ceid=US%3Aen', 'Sports', 'Daily major-team personnel, legacy and competition coverage.', true),
    ('rss', 'Texas Amateur and College Sports — Daily Discovery', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Texas+Tech+track+OR+Texas+high+school+sports+OR+Texas+college+athlete+OR+World+Under-20+Texas%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen', 'Sports', 'Texas athletes beyond the major professional leagues.', true),
    ('rss', 'North Texas Local — Daily Discovery', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Dallas+OR+Fort+Worth+OR+Irving+OR+Plano+OR+Richardson+OR+Lakeside%29+Texas+when%3A2d&hl=en-US&gl=US&ceid=US%3Aen', 'Texas News', 'North Texas local coverage including municipalities and suburban stories.', true),
    ('rss', 'South and Central Texas Local — Daily Discovery', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Corpus+Christi+OR+Kingsville+OR+Bastrop+OR+Ingram+OR+Canyon+Lake%29+Texas+when%3A2d&hl=en-US&gl=US&ceid=US%3Aen', 'Texas News', 'South and Central Texas local coverage that broad statewide feeds can miss.', true)
)
INSERT INTO public.content_sources (platform, source_name, source_url, rss_url, category, notes, enabled)
SELECT s.*
FROM sources s
WHERE NOT EXISTS (
  SELECT 1 FROM public.content_sources existing
  WHERE lower(existing.rss_url) = lower(s.rss_url)
);

UPDATE public.content_sources
SET enabled = true
WHERE source_name LIKE '%Daily Discovery';
