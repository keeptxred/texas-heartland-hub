
ALTER TABLE public.daily_articles
  ADD COLUMN IF NOT EXISTS kind TEXT NOT NULL DEFAULT 'news',
  ADD COLUMN IF NOT EXISTS body_json JSONB,
  ADD COLUMN IF NOT EXISTS keywords TEXT[];

CREATE INDEX IF NOT EXISTS daily_articles_kind_idx ON public.daily_articles(kind, published_at DESC);
