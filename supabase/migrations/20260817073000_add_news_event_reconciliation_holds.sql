create table if not exists public.news_event_reconciliation_holds (
  id uuid primary key default gen_random_uuid(),
  group_key text not null unique,
  review_status text not null default 'pending' check (review_status in ('pending', 'resolved', 'ignored')),
  reason text not null,
  feed_item_ids bigint[] not null default '{}',
  published_slugs text[] not null default '{}',
  source_families text[] not null default '{}',
  details jsonb not null default '{}'::jsonb,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_news_event_reconciliation_holds_status
  on public.news_event_reconciliation_holds (review_status, last_seen_at desc);

alter table public.news_event_reconciliation_holds enable row level security;

comment on table public.news_event_reconciliation_holds is
  'Operator review queue for historical event groups that cannot be reconciled deterministically without changing canonical ownership.';
