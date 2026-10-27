-- LIVE PRODUCTION ALREADY APPLIED via Supabase migration 20261027164517.
-- October 27 I/O/free-tier recovery: nonunique indexes with zero PostgreSQL
-- idx_scan since the 2026-10-06 statistics reset, verified no FK/constraint
-- dependencies. Removing these indexes does NOT remove any table rows.
-- Reversible restore DDL, if a newly introduced query needs them:
-- CREATE INDEX idx_news_feed_normalization_canonical_url
--   ON public.news_feed_normalization USING btree (canonical_url);
-- CREATE INDEX idx_news_event_facts_primary
--   ON public.news_event_facts USING btree (cluster_id, primary_record_support, confidence DESC);
-- CREATE INDEX idx_news_feed_normalization_source_title
--   ON public.news_feed_normalization USING btree (source_key, title_fingerprint, observed_at DESC);
--
-- The 3 indexes occupied 14,991,360 physical bytes. Migration measured
-- database size dropping from ~510.4MB to 495,701,139 bytes. This is
-- a short-term buffer ONLY: renewed growth requires safe ongoing archival.
-- Do NOT drop other indexes just because idx_scan happens to be zero.
SET lock_timeout = '3s';
DROP INDEX IF EXISTS public.idx_news_feed_normalization_canonical_url;
DROP INDEX IF EXISTS public.idx_news_event_facts_primary;
DROP INDEX IF EXISTS public.idx_news_feed_normalization_source_title;
RESET lock_timeout;
