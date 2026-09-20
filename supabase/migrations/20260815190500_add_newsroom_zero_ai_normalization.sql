-- Low-credit newsroom Phase 3: deterministic normalization and deduplication.
-- Raw texas_news_feed rows remain untouched. Independent outlets reporting the
-- same event remain distinct so Phase 4 can cluster them into MERGE packages.

CREATE TABLE IF NOT EXISTS public.news_feed_normalization (
  feed_item_id bigint PRIMARY KEY REFERENCES public.texas_news_feed(id) ON DELETE CASCADE,
  normalized_title text NOT NULL,
  normalized_description text,
  canonical_url text NOT NULL,
  source_key text NOT NULL,
  title_fingerprint text NOT NULL,
  content_fingerprint text,
  duplicate_of_feed_item_id bigint REFERENCES public.texas_news_feed(id) ON DELETE SET NULL,
  duplicate_reason text CHECK (duplicate_reason IS NULL OR duplicate_reason IN ('canonical-url','same-source-title')),
  dedupe_confidence real,
  observed_at timestamptz NOT NULL,
  normalization_version integer NOT NULL DEFAULT 1 CHECK (normalization_version > 0),
  normalized_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (dedupe_confidence IS NULL OR (dedupe_confidence >= 0 AND dedupe_confidence <= 1)),
  CHECK ((duplicate_of_feed_item_id IS NULL) = (duplicate_reason IS NULL)),
  CHECK (duplicate_of_feed_item_id IS NULL OR duplicate_of_feed_item_id <> feed_item_id)
);

CREATE INDEX IF NOT EXISTS idx_news_feed_normalization_canonical_url
  ON public.news_feed_normalization(canonical_url);
CREATE INDEX IF NOT EXISTS idx_news_feed_normalization_source_title
  ON public.news_feed_normalization(source_key, title_fingerprint, observed_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_feed_normalization_duplicate
  ON public.news_feed_normalization(duplicate_of_feed_item_id)
  WHERE duplicate_of_feed_item_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_news_feed_normalization_observed
  ON public.news_feed_normalization(observed_at DESC);

DROP TRIGGER IF EXISTS trg_news_feed_normalization_updated_at ON public.news_feed_normalization;
CREATE TRIGGER trg_news_feed_normalization_updated_at
BEFORE UPDATE ON public.news_feed_normalization
FOR EACH ROW EXECUTE FUNCTION public.newsroom_set_updated_at();

COMMENT ON TABLE public.news_feed_normalization IS
  'Deterministic, zero-AI normalization sidecar for texas_news_feed. Keeps raw source rows immutable and preserves cross-outlet reporting for story clustering.';
COMMENT ON COLUMN public.news_feed_normalization.duplicate_of_feed_item_id IS
  'Only exact canonical-URL duplicates or same-source normalized-title repeats are collapsed. Cross-outlet same-event reports intentionally remain independent.';

-- Run normalization after the normal ingestion windows without changing any
-- existing publishing, sports ingestion, or classifier schedules.
SELECT cron.schedule(
  'keep-tx-red-normalize-newsroom-feed',
  '7,22,37,52 * * * *',
  $$
    SELECT net.http_post(
      url := 'https://keeptxred.com/api/public/hooks/normalize-newsroom-feed',
      headers := '{"Content-Type":"application/json","Accept":"application/json"}'::jsonb,
      body := '{"source":"pg_cron"}'::jsonb,
      timeout_milliseconds := 120000
    );
  $$
);
