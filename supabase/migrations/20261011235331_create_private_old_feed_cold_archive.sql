-- Applied to shared project ftkznprjljkhymknvhye; archival candidate selection and data copy are separately verified operations.

create table if not exists private.feed_cold_batches (
 archive_key text primary key,
 source_table text not null check (source_table in ('texas_news_feed','news_feed_normalization','newsroom_source_page_fetch_state')),
 schema_version integer not null default 1 check (schema_version=1),
 archive_created_at timestamptz not null default now(),
 record_count integer not null check (record_count between 1 and 150),
 record_keys_md5 text not null,
 records jsonb not null check (jsonb_typeof(records)='array')
);
alter table private.feed_cold_batches enable row level security;
revoke all on private.feed_cold_batches from public,anon,authenticated;
comment on table private.feed_cold_batches is
 'Private exact-record archive of old incoming RSS feed items and their associated normalization/fetch-state rows; protects all published and referenced items.';

