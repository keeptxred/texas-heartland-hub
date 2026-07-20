WITH bad AS (
  SELECT link, internal_slug FROM public.texas_news_feed
  WHERE title ~* '\m(word\s+wrangler|horoscope|newsletter|crossword|sudoku|word\s*(game|search|jumble)|(daily|weekly)\s+puzzle|puzzle\s+(for|of\s+the\s+day)|mini\s+puzzle|quiz\s+of\s+the\s+(day|week)|cartoon\s+of\s+the\s+day)\M'
)
DELETE FROM public.daily_articles
 WHERE slug IN (SELECT internal_slug FROM bad WHERE internal_slug IS NOT NULL)
    OR source_url IN (SELECT link FROM bad);
DELETE FROM public.texas_news_feed
 WHERE title ~* '\m(word\s+wrangler|horoscope|newsletter|crossword|sudoku|word\s*(game|search|jumble)|(daily|weekly)\s+puzzle|puzzle\s+(for|of\s+the\s+day)|mini\s+puzzle|quiz\s+of\s+the\s+(day|week)|cartoon\s+of\s+the\s+day)\M';