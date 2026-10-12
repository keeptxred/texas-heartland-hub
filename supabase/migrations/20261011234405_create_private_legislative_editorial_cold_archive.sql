-- Already deployed to production; archive contents generated separately and verified by row equality.

create table if not exists private.legislative_opportunity_cold_batches (
  archive_key text primary key,
  schema_version integer not null default 1 check (schema_version = 1),
  archived_at timestamptz not null default now(),
  record_count integer not null check (record_count > 0 and record_count <= 500),
  first_event_date date,
  last_event_date date,
  record_ids_md5 text not null,
  records jsonb not null check (jsonb_typeof(records) = 'array')
);
alter table private.legislative_opportunity_cold_batches enable row level security;
revoke all on private.legislative_opportunity_cold_batches from public, anon, authenticated;
comment on table private.legislative_opportunity_cold_batches is
  'Recoverable versioned cold archive of superseded unpublished legislative editorial opportunities; never official bills or actions.';

