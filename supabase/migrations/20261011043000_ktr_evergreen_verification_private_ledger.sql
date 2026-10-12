-- Private, server-only KeepTXRed editorial verification ledger.
create table if not exists public.ktr_evergreen_verifications (
 entity_id text primary key, route text not null,
 cadence text not null check(cadence in ('daily','weekly','monthly','quarterly','event-driven')),
 status text not null default 'pending',
 official_sources jsonb not null default '[]'::jsonb,
 evidence jsonb not null default '[]'::jsonb,
 pending_changes jsonb not null default '[]'::jsonb,
 last_checked_at timestamptz, last_verified_at timestamptz,
 last_content_changed_at timestamptz, next_check_at timestamptz,
 reviewer_approved_at timestamptz, updated_at timestamptz not null default now()
);
create table if not exists public.ktr_evergreen_verification_events (
 id bigint generated always as identity primary key,
 entity_id text not null references public.ktr_evergreen_verifications(entity_id) on delete cascade,
 event_type text not null,
 evidence jsonb not null default '[]'::jsonb,
 changes jsonb not null default '[]'::jsonb,
 created_at timestamptz not null default now()
);
create index if not exists ktr_evergreen_due_idx on public.ktr_evergreen_verifications(next_check_at);
create index if not exists ktr_evergreen_events_entity_idx on public.ktr_evergreen_verification_events(entity_id,created_at desc);
alter table public.ktr_evergreen_verifications enable row level security;
alter table public.ktr_evergreen_verification_events enable row level security;
revoke all on public.ktr_evergreen_verifications,public.ktr_evergreen_verification_events from anon,authenticated;
grant select,insert,update,delete on public.ktr_evergreen_verifications,public.ktr_evergreen_verification_events to service_role;
grant usage,select on sequence public.ktr_evergreen_verification_events_id_seq to service_role;
