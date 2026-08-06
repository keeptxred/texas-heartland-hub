-- Brand-aware correction for statewide discovery feeds.
-- KeepTXRed retains public-affairs coverage. Lifestyle, travel, health, culture,
-- and general sports discovery belongs to TexasDefined.

WITH keeptxred_sources(platform, source_name, source_url, rss_url, category, notes, enabled) AS (
  VALUES
    ('rss', 'Texas State Agencies — Google News', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28site%3Atexas.gov+OR+site%3Atx.gov%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen', 'Politics', 'KeepTXRed: official Texas agency announcements, grants, emergency actions, rules, and public notices.', true),
    ('rss', 'Texas Courts and Civil Rights — Google News', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Texas+lawsuit+OR+Texas+court+OR+%22religious+freedom%22+Texas+OR+%22First+Amendment%22+Texas%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen', 'Politics', 'KeepTXRed: litigation affecting Texas residents, schools, institutions, elections, and government.', true),
    ('rss', 'Texas Local Government — Google News', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28%22county+commissioners%22+Texas+OR+%22city+council%22+Texas+OR+%22polling+locations%22+Texas+OR+%22school+district%22+Texas%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen', 'Local', 'KeepTXRed: county, municipal, election-administration, and school-district decisions with public impact.', true),
    ('rss', 'Texas Business and Workforce — Google News', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Texas+jobs+OR+Texas+workforce+OR+Texas+grant+OR+Texas+layoffs+OR+Texas+business%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen', 'Business', 'KeepTXRed: jobs, grants, employers, wages, layoffs, and statewide economic policy developments.', true),
    ('rss', 'Texas Policy, Population and Migration — Google News', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Texas+migration+OR+Texas+population+OR+Texas+demographics%29+%28policy+OR+election+OR+economy+OR+housing+OR+government%29+when%3A7d&hl=en-US&gl=US&ceid=US%3Aen', 'Politics', 'KeepTXRed: migration and demographic reporting only when tied to policy, elections, housing, government, or the economy.', true),
    ('rss', 'Texas Wildfire and Emergency — Google News', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Texas+wildfire+OR+Texas+fire+danger+OR+TDEM+OR+%22Texas+A%26M+Forest+Service%22%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen', 'Weather', 'KeepTXRed: wildfire danger, emergency activations, disasters, and government response resources.', true)
)
INSERT INTO public.content_sources (platform, source_name, source_url, rss_url, category, notes, enabled)
SELECT s.*
FROM keeptxred_sources s
WHERE NOT EXISTS (
  SELECT 1 FROM public.content_sources existing
  WHERE lower(existing.rss_url) = lower(s.rss_url)
);

UPDATE public.content_sources existing
SET source_name = s.source_name,
    category = s.category,
    notes = s.notes,
    enabled = true
FROM keeptxred_sources s
WHERE lower(existing.rss_url) = lower(s.rss_url);

-- These broad lifestyle feeds are intentionally owned by TexasDefined.
UPDATE public.content_sources
SET enabled = false,
    notes = concat('TexasDefined-owned source; disabled for KeepTXRed. ', coalesce(notes, ''))
WHERE source_name IN (
  'Texas Universities — Google News',
  'Texas Hospitals and Health — Google News',
  'Moving to Texas and Demographics — Google News',
  'Texas Culture and Attractions — Google News',
  'Texas Sports Statewide — Google News'
);
