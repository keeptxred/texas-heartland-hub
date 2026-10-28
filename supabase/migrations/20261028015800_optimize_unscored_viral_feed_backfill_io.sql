-- Shared KTR/TD Supabase Free Plan I/O recovery, 2026-10-28.
-- Production pg_stat_statements since Oct 6: the newsroom score-viral
-- 21-day backfill query ran 635 times, mean 3,361ms, 2,134s cumulative
-- and 8,940,530 shared-buffer hits, scanning scored rows to locate
-- viral_scored_at IS NULL. A live EXPLAIN ANALYZE scanned 15,559 scored
-- rows, read 15,536 database blocks, and needed 9,626ms to find 33 rows.
--
-- A ROLLBACK-only CREATE INDEX + EXPLAIN test proved a 2.579ms index-only
-- plan with just 10 buffers and 7 heap fetches (same 33 results). Roughly
-- 282 of 25,379 total feed rows are unscored, so this intentionally small
-- partial btree index avoids indexing every published/processed feed item.
--
-- Exact query consumer: src/routes/api/public/hooks/score-viral.ts,
-- which filters >=21 days + viral_scored_at IS NULL, ordered pub_date DESC.
-- No publication, routing, editorial, approval, RLS or role changes.
SET lock_timeout = '3s';
CREATE INDEX IF NOT EXISTS idx_texas_news_feed_unscored_backfill_recent
  ON public.texas_news_feed USING btree (pub_date DESC, id DESC)
  WHERE viral_scored_at IS NULL;
RESET lock_timeout;
