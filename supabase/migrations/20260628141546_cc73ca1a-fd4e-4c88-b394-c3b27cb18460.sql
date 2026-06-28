CREATE TABLE public.texas_news_feed (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  source TEXT NOT NULL,
  link TEXT NOT NULL UNIQUE,
  description TEXT,
  pub_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_texas_news_feed_pub_date ON public.texas_news_feed (pub_date DESC);

GRANT SELECT ON public.texas_news_feed TO anon, authenticated;
GRANT ALL ON public.texas_news_feed TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.texas_news_feed_id_seq TO service_role;

ALTER TABLE public.texas_news_feed ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read texas_news_feed"
  ON public.texas_news_feed FOR SELECT
  TO anon, authenticated
  USING (true);
