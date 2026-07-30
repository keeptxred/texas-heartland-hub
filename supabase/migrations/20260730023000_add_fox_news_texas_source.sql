-- Add national Texas-focused discovery so high-interest Texas political stories
-- from Fox News are not missed by the otherwise local/official source mix.

INSERT INTO public.content_sources (
  platform, source_name, source_url, rss_url, category, notes, enabled
)
SELECT
  'rss',
  'Fox News — Texas (Google News)',
  'https://www.foxnews.com/category/us/texas',
  'https://news.google.com/rss/search?q=site%3Afoxnews.com+Texas+when%3A7d&hl=en-US&gl=US&ceid=US%3Aen',
  'Politics',
  'Texas-focused Fox News discovery feed. Items remain subject to the shared Texas relevance gate.',
  true
WHERE NOT EXISTS (
  SELECT 1
  FROM public.content_sources
  WHERE lower(rss_url) = lower(
    'https://news.google.com/rss/search?q=site%3Afoxnews.com+Texas+when%3A7d&hl=en-US&gl=US&ceid=US%3Aen'
  )
);
