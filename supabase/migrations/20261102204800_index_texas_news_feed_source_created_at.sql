-- Incident: 2026-11-02 18:12:59Z production GET /rest/v1/texas_news_feed
-- returned HTTP 500, PostgREST error=57014, after ~8.8 seconds.
-- Specific source + 14d created_at filter + newest-first limit 8.
-- Prior plan used (created_at DESC, id DESC), then filtered ~10.7k
-- recent unrelated rows to locate 4 matching direct TDEM releases.
--
-- Full two-column btree supports PostgREST parameterized source equality
-- (a source-specific partial index may not be used with generic plans).
-- Tiny data footprint (~29k rows); no content mutation, RLS, grant or
-- source acceptance changes. Existing date index remains in place.
create index if not exists texas_news_feed_source_created_at_idx
  on public.texas_news_feed (source, created_at desc);
