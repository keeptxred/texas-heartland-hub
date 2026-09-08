create or replace function private.skip_semantically_unchanged_update()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
declare
  new_data jsonb := to_jsonb(new);
  old_data jsonb := to_jsonb(old);
  ignored text;
begin
  foreach ignored in array coalesce(tg_argv, array[]::text[]) loop
    new_data := new_data - ignored;
    old_data := old_data - ignored;
  end loop;

  if new_data is not distinct from old_data then
    return null;
  end if;

  return new;
end;
$$;

comment on function private.skip_semantically_unchanged_update() is
  'Cancels UPDATEs whose only differences are explicitly ignored processing timestamps, reducing repeated pipeline heap/index writes while preserving meaningful changes.';

drop trigger if exists aaa_skip_noop_texas_news_feed on public.texas_news_feed;
create trigger aaa_skip_noop_texas_news_feed
before update on public.texas_news_feed
for each row execute function private.skip_semantically_unchanged_update('viral_scored_at');

drop trigger if exists aaa_skip_noop_news_feed_normalization on public.news_feed_normalization;
create trigger aaa_skip_noop_news_feed_normalization
before update on public.news_feed_normalization
for each row execute function private.skip_semantically_unchanged_update('normalized_at','updated_at');

drop trigger if exists aaa_skip_noop_news_story_clusters on public.news_story_clusters;
create trigger aaa_skip_noop_news_story_clusters
before update on public.news_story_clusters
for each row execute function private.skip_semantically_unchanged_update('last_seen_at','updated_at');

drop trigger if exists aaa_skip_noop_news_story_cluster_items on public.news_story_cluster_items;
create trigger aaa_skip_noop_news_story_cluster_items
before update on public.news_story_cluster_items
for each row execute function private.skip_semantically_unchanged_update();

drop trigger if exists aaa_skip_noop_news_publish_candidates on public.news_publish_candidates;
create trigger aaa_skip_noop_news_publish_candidates
before update on public.news_publish_candidates
for each row execute function private.skip_semantically_unchanged_update('updated_at');

drop trigger if exists aaa_skip_noop_news_research_packets on public.news_research_packets;
create trigger aaa_skip_noop_news_research_packets
before update on public.news_research_packets
for each row execute function private.skip_semantically_unchanged_update('built_at','updated_at');

drop trigger if exists aaa_skip_noop_news_event_facts on public.news_event_facts;
create trigger aaa_skip_noop_news_event_facts
before update on public.news_event_facts
for each row execute function private.skip_semantically_unchanged_update();
