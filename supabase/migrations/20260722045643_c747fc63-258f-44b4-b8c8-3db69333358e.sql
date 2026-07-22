ALTER TABLE public.texas_news_feed
  ADD COLUMN IF NOT EXISTS preflight_json jsonb,
  ADD COLUMN IF NOT EXISTS extracted_body text;

CREATE INDEX IF NOT EXISTS idx_texas_news_feed_preflight_status
  ON public.texas_news_feed ((preflight_json->>'status'));