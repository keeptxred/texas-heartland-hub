-- Applied to shared project ftkznprjljkhymknvhye; archival candidate selection and data copy are separately verified operations.

create table if not exists private.newsroom_cold_batches (
 archive_key text primary key,
 source_table text not null check (source_table in ('news_story_clusters','news_publish_candidates','news_research_packets','news_story_cluster_items')),
 schema_version integer not null default 1 check (schema_version=1),
 archive_created_at timestamptz not null default now(),
 record_count integer not null check (record_count between 1 and 200),
 record_ids_md5 text not null,
 records jsonb not null check (jsonb_typeof(records)='array')
);
alter table private.newsroom_cold_batches enable row level security;
revoke all on private.newsroom_cold_batches from public,anon,authenticated;
comment on table private.newsroom_cold_batches is
 'Private lossless cold archive for dormant unpublished newsroom workflow records; not authoritative public content.';

