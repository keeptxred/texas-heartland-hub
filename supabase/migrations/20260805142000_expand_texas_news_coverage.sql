-- Expand statewide discovery beyond politics-only and a handful of publisher feeds.
-- Google News RSS is used as a discovery layer; ingest-feeds.ts still applies
-- Texas relevance, source reputation, duplicate, and editorial quality gates.

WITH sources(platform, source_name, source_url, rss_url, category, notes, enabled) AS (
  VALUES
    ('rss', 'Texas State Agencies — Google News', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28site%3Atexas.gov+OR+site%3Atx.gov%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen', 'Politics', 'Official Texas agency announcements, grants, emergency actions, rules, and public notices.', true),
    ('rss', 'Texas Universities — Google News', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28%22Texas+A%26M%22+OR+%22University+of+Texas%22+OR+%22Texas+Tech%22+OR+%22UT+System%22%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen', 'Education', 'University governance, research, litigation, campus policy, and major institutional news.', true),
    ('rss', 'Texas Hospitals and Health — Google News', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Texas+hospital+OR+%22Houston+Methodist%22+OR+%22UT+Southwestern%22+OR+%22Baylor+University+Medical+Center%22%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen', 'Non-Political', 'Hospital rankings, public health, healthcare workforce, and major medical-system news.', true),
    ('rss', 'Texas Courts and Civil Rights — Google News', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Texas+lawsuit+OR+Texas+court+OR+%22religious+freedom%22+Texas+OR+%22First+Amendment%22+Texas%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen', 'Politics', 'State and federal litigation affecting Texas residents, schools, institutions, and government.', true),
    ('rss', 'Texas Local Government — Google News', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28%22county+commissioners%22+Texas+OR+%22city+council%22+Texas+OR+%22polling+locations%22+Texas+OR+%22school+district%22+Texas%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen', 'Local', 'County, municipal, election administration, and school-district decisions with public impact.', true),
    ('rss', 'Texas Business and Workforce — Google News', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Texas+jobs+OR+Texas+workforce+OR+Texas+grant+OR+Texas+layoffs+OR+Texas+business%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen', 'Business', 'Jobs, grants, employers, wages, layoffs, and statewide or regional economic developments.', true),
    ('rss', 'Moving to Texas and Demographics — Google News', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28%22moving+to+Texas%22+OR+Texas+migration+OR+Texas+population+OR+Texas+demographics%29+when%3A7d&hl=en-US&gl=US&ceid=US%3Aen', 'Non-Political', 'Migration, population, relocation, and demographic reports relevant to TexasDefined and KeepTXRed audiences.', true),
    ('rss', 'Texas Culture and Attractions — Google News', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Texas+museum+OR+Texas+attraction+OR+Whataburger+OR+%22Six+Flags+Over+Texas%22%29+when%3A7d&hl=en-US&gl=US&ceid=US%3Aen', 'Non-Political', 'Museums, attractions, Texas brands, anniversaries, expansions, and statewide culture stories.', true),
    ('rss', 'Texas Wildfire and Emergency — Google News', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Texas+wildfire+OR+Texas+fire+danger+OR+TDEM+OR+%22Texas+A%26M+Forest+Service%22%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen', 'Weather', 'Wildfire danger, emergency activations, disasters, and response resources.', true),
    ('rss', 'Texas Sports Statewide — Google News', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Dallas+Cowboys+OR+Houston+Texans+OR+Texas+Rangers+OR+Houston+Astros+OR+FC+Dallas%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen', 'Sports', 'Major Texas professional sports developments and locally significant team news.', true)
)
INSERT INTO public.content_sources (platform, source_name, source_url, rss_url, category, notes, enabled)
SELECT s.*
FROM sources s
WHERE NOT EXISTS (
  SELECT 1
  FROM public.content_sources existing
  WHERE lower(existing.rss_url) = lower(s.rss_url)
);

-- Keep these discovery feeds enabled if a previous partial seed created them.
UPDATE public.content_sources
SET enabled = true,
    notes = CASE
      WHEN coalesce(notes, '') = '' THEN 'Statewide coverage discovery feed.'
      ELSE notes
    END
WHERE source_name IN (
  'Texas State Agencies — Google News',
  'Texas Universities — Google News',
  'Texas Hospitals and Health — Google News',
  'Texas Courts and Civil Rights — Google News',
  'Texas Local Government — Google News',
  'Texas Business and Workforce — Google News',
  'Moving to Texas and Demographics — Google News',
  'Texas Culture and Attractions — Google News',
  'Texas Wildfire and Emergency — Google News',
  'Texas Sports Statewide — Google News'
);
