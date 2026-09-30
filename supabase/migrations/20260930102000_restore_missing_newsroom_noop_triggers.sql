-- Restore two no-op suppression triggers that are present in migration history
-- but missing from production. These BEFORE UPDATE triggers cancel writes when
-- the only changed fields are processing timestamps, reducing heap/index churn,
-- WAL volume, autovacuum pressure, and Disk IO budget consumption.

drop trigger if exists aaa_skip_noop_texas_news_feed on public.texas_news_feed;
create trigger aaa_skip_noop_texas_news_feed
before update on public.texas_news_feed
for each row execute function private.skip_semantically_unchanged_update('viral_scored_at');

drop trigger if exists aaa_skip_noop_news_story_clusters on public.news_story_clusters;
create trigger aaa_skip_noop_news_story_clusters
before update on public.news_story_clusters
for each row execute function private.skip_semantically_unchanged_update('last_seen_at','updated_at');
