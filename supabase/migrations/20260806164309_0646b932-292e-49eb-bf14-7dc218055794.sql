WITH sources(platform, source_name, source_url, rss_url, category, notes, enabled) AS (
  VALUES
    ('rss', 'Texas Universities and Campus Life', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28%22Texas+university%22+OR+%22Texas+A%26M%22+OR+%22University+of+Texas%22+OR+%22Texas+Tech%22+OR+%22campus+life%22+Texas%29+when%3A7d&hl=en-US&gl=US&ceid=US%3Aen', 'Education', 'TexasDefined-owned: university news, campus life, student experience, and higher-education lifestyle coverage.', true),
    ('rss', 'Texas Hospitals, Health and Rankings', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Texas+hospital+OR+%22Texas+Medical+Center%22+OR+%22best+hospitals%22+Texas+OR+Texas+health+rankings%29+when%3A7d&hl=en-US&gl=US&ceid=US%3Aen', 'Health', 'TexasDefined-owned: hospitals, health systems, rankings, and healthcare lifestyle coverage.', true),
    ('rss', 'Moving to Texas and Relocation', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28%22moving+to+Texas%22+OR+%22relocating+to+Texas%22+OR+%22best+places+to+live%22+Texas%29+when%3A7d&hl=en-US&gl=US&ceid=US%3Aen', 'Relocation', 'TexasDefined-owned: relocation guides, best-places-to-live coverage, and newcomer lifestyle reporting.', true),
    ('rss', 'Texas Culture and Attractions', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Texas+attractions+OR+Texas+festival+OR+Texas+museum+OR+%22things+to+do%22+Texas+OR+Texas+state+park%29+when%3A7d&hl=en-US&gl=US&ceid=US%3Aen', 'Culture', 'TexasDefined-owned: attractions, festivals, museums, parks, and things-to-do coverage.', true),
    ('rss', 'Texas Sports and Fan Culture', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Texas+sports+OR+Cowboys+OR+Texans+OR+Astros+OR+Mavericks+OR+Longhorns+OR+%22fan+culture%22+Texas%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen', 'Sports', 'TexasDefined-owned: statewide sports, teams, and fan-culture coverage.', true)
)
INSERT INTO public.content_sources (platform, source_name, source_url, rss_url, category, notes, enabled)
SELECT s.platform, s.source_name, s.source_url, s.rss_url, s.category, s.notes, s.enabled
FROM sources s
WHERE NOT EXISTS (
  SELECT 1 FROM public.content_sources existing
  WHERE lower(existing.rss_url) = lower(s.rss_url)
);

WITH sources(platform, source_name, source_url, rss_url, category, notes, enabled) AS (
  VALUES
    ('rss', 'Texas Universities and Campus Life', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28%22Texas+university%22+OR+%22Texas+A%26M%22+OR+%22University+of+Texas%22+OR+%22Texas+Tech%22+OR+%22campus+life%22+Texas%29+when%3A7d&hl=en-US&gl=US&ceid=US%3Aen', 'Education', 'TexasDefined-owned: university news, campus life, student experience, and higher-education lifestyle coverage.', true),
    ('rss', 'Texas Hospitals, Health and Rankings', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Texas+hospital+OR+%22Texas+Medical+Center%22+OR+%22best+hospitals%22+Texas+OR+Texas+health+rankings%29+when%3A7d&hl=en-US&gl=US&ceid=US%3Aen', 'Health', 'TexasDefined-owned: hospitals, health systems, rankings, and healthcare lifestyle coverage.', true),
    ('rss', 'Moving to Texas and Relocation', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28%22moving+to+Texas%22+OR+%22relocating+to+Texas%22+OR+%22best+places+to+live%22+Texas%29+when%3A7d&hl=en-US&gl=US&ceid=US%3Aen', 'Relocation', 'TexasDefined-owned: relocation guides, best-places-to-live coverage, and newcomer lifestyle reporting.', true),
    ('rss', 'Texas Culture and Attractions', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Texas+attractions+OR+Texas+festival+OR+Texas+museum+OR+%22things+to+do%22+Texas+OR+Texas+state+park%29+when%3A7d&hl=en-US&gl=US&ceid=US%3Aen', 'Culture', 'TexasDefined-owned: attractions, festivals, museums, parks, and things-to-do coverage.', true),
    ('rss', 'Texas Sports and Fan Culture', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Texas+sports+OR+Cowboys+OR+Texans+OR+Astros+OR+Mavericks+OR+Longhorns+OR+%22fan+culture%22+Texas%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen', 'Sports', 'TexasDefined-owned: statewide sports, teams, and fan-culture coverage.', true)
)
UPDATE public.content_sources existing
SET source_name = s.source_name,
    platform = s.platform,
    source_url = s.source_url,
    category = s.category,
    notes = s.notes,
    enabled = true
FROM sources s
WHERE lower(existing.rss_url) = lower(s.rss_url);