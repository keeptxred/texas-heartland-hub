-- Reconcile three newly activated Google News discovery feeds that were
-- transport-healthy but query-empty in production. These broader queries
-- improve discovery yield while preserving all downstream Texas-relevance,
-- source-quality, clustering, verification, and publication-readiness gates.

UPDATE public.content_sources
SET rss_url = CASE source_name
  WHEN 'Texas Attorney General Actions — Google News' THEN
    'https://news.google.com/rss/search?q=%28%22Texas+Attorney+General%22+OR+site%3Atexasattorneygeneral.gov%29+when%3A7d&hl=en-US&gl=US&ceid=US%3Aen'
  WHEN 'Texas Sports Recruiting and Partnerships — Google News' THEN
    'https://news.google.com/rss/search?q=%28%22Texas+Tech%22+OR+%22Texas+Longhorns%22+OR+%22Texas+A%26M%22+OR+Baylor+OR+SMU+OR+TCU%29+%28commitment+OR+recruiting+OR+partnership+OR+sponsor%29+when%3A7d&hl=en-US&gl=US&ceid=US%3Aen'
  WHEN 'Texas Zoos Wildlife and Conservation — Google News' THEN
    'https://news.google.com/rss/search?q=%28Texas+zoo+OR+Texas+wildlife+OR+Texas+conservation%29+when%3A7d&hl=en-US&gl=US&ceid=US%3Aen'
  ELSE rss_url
END
WHERE source_name IN (
  'Texas Attorney General Actions — Google News',
  'Texas Sports Recruiting and Partnerships — Google News',
  'Texas Zoos Wildlife and Conservation — Google News'
);
