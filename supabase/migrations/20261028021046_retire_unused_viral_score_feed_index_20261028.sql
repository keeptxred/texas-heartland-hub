-- LIVE PRODUCTION ALREADY APPLIED at Supabase migration version 20261028021046.
-- Shared Supabase project ftkznprjljkhymknvhye.
--
-- One targeted 1,679,360-byte nonunique B-tree index had 0 recorded scans
-- since the 2026-10-06 PostgreSQL stats reset. Verified constraints=0 and
-- noninternal dependents=0 before removal at 2026-10-28 02:10 UTC.
-- It indexed every feed row (viral_score DESC, pub_date DESC) despite the
-- active read workload using pub_date/target-site filters instead.
--
-- Protected partial index idx_texas_news_feed_unscored_backfill_recent
-- remains installed; it made the actual viral-score backfill read ~1,800x
-- faster on the most recent full-projection production test.
-- No public rows, feeds, articles, RLS, or editorial constraints removed.
--
-- Exact reversible restoration DDL if future score-first ranking needs it:
-- CREATE INDEX texas_news_feed_viral_score_idx ON public.texas_news_feed
--   USING btree (viral_score DESC, pub_date DESC);
SET lock_timeout='3s';
DROP INDEX IF EXISTS public.texas_news_feed_viral_score_idx;
RESET lock_timeout;
