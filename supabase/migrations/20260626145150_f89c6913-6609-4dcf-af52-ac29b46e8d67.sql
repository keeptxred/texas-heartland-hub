
CREATE TABLE public.daily_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  dek TEXT NOT NULL,
  body TEXT,
  author TEXT NOT NULL DEFAULT 'Keep TX Red Newsroom',
  source_name TEXT,
  source_url TEXT,
  image_url TEXT,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX daily_articles_published_at_idx ON public.daily_articles (published_at DESC);

GRANT SELECT ON public.daily_articles TO anon, authenticated;
GRANT ALL ON public.daily_articles TO service_role;

ALTER TABLE public.daily_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read articles"
  ON public.daily_articles
  FOR SELECT
  USING (true);

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;
