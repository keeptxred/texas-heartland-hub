ALTER TABLE public.daily_articles
  ADD COLUMN IF NOT EXISTS featured_image_url text,
  ADD COLUMN IF NOT EXISTS image_prompt text,
  ADD COLUMN IF NOT EXISTS image_generation_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS image_alt_text text;

CREATE INDEX IF NOT EXISTS daily_articles_image_gen_status_idx
  ON public.daily_articles (image_generation_status)
  WHERE image_generation_status IN ('pending','failed');
