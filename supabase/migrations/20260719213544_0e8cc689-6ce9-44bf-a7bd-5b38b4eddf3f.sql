
ALTER TABLE public.content_sources
  ADD COLUMN IF NOT EXISTS source_reputation_score smallint,
  ADD COLUMN IF NOT EXISTS source_quality_reason text;

ALTER TABLE public.texas_news_feed
  ADD COLUMN IF NOT EXISTS texas_relevance_score smallint,
  ADD COLUMN IF NOT EXISTS source_reputation_score smallint,
  ADD COLUMN IF NOT EXISTS routing_type text,
  ADD COLUMN IF NOT EXISTS trend_velocity real,
  ADD COLUMN IF NOT EXISTS source_count smallint,
  ADD COLUMN IF NOT EXISTS ready_for_rewrite boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_texas_news_feed_ready_rewrite
  ON public.texas_news_feed (ready_for_rewrite, viral_score DESC)
  WHERE ready_for_rewrite = true;
