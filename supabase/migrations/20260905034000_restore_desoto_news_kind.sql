-- BULK_ARTICLE_MAINTENANCE
-- Preserve the DeSoto September 4 article as a normal public news article.
UPDATE public.daily_articles
SET kind = 'news'
WHERE slug = '2026-09-04-desoto-handshake-viral-backlash'
  AND kind IS DISTINCT FROM 'news';
