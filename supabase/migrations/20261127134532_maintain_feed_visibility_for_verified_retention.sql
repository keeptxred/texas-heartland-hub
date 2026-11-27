SET LOCAL lock_timeout = '2s';
-- Restore visibility-map coverage sooner after bounded verified archive and scoring churn.
-- No new index, no eligibility or timeout change, no data deletion.
ALTER TABLE public.texas_news_feed SET (autovacuum_vacuum_threshold = 100, autovacuum_vacuum_scale_factor = 0.025, autovacuum_analyze_scale_factor = 0.05);
