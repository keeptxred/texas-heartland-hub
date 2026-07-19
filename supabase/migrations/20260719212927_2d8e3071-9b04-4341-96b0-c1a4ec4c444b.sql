ALTER TABLE public.texas_news_feed
  ADD COLUMN IF NOT EXISTS viral_score smallint NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS viral_signals jsonb,
  ADD COLUMN IF NOT EXISTS trend_source text,
  ADD COLUMN IF NOT EXISTS classification_confidence real,
  ADD COLUMN IF NOT EXISTS viral_scored_at timestamptz;

CREATE INDEX IF NOT EXISTS texas_news_feed_viral_score_idx
  ON public.texas_news_feed (viral_score DESC, pub_date DESC);