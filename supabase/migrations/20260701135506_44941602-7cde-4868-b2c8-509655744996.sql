ALTER TABLE public.daily_articles
  ADD COLUMN IF NOT EXISTS seo_headline text,
  ADD COLUMN IF NOT EXISTS discover_category text,
  ADD COLUMN IF NOT EXISTS seo_keywords text[];