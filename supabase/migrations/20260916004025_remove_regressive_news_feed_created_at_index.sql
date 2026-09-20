-- Production EXPLAIN showed the wide newsroom-normalization read was faster as
-- a sequential scan on the current table shape. Do not force the planner into
-- random heap access for the 1,000-row batch.
drop index if exists public.texas_news_feed_created_at_idx;
