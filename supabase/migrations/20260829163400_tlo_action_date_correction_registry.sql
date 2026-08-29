create schema if not exists private;

create table if not exists private.tlo_action_date_corrections (
  source_url text primary key,
  published_action_date date not null,
  corrected_action_date date not null,
  reason text not null,
  verified_at timestamptz not null default now()
);

revoke all on table private.tlo_action_date_corrections from public, anon, authenticated;

insert into private.tlo_action_date_corrections(
  source_url,
  published_action_date,
  corrected_action_date,
  reason,
  verified_at
) values
  (
    'http://journals.house.texas.gov/hjrnl/892/pdf/89C2DAY05CFINAL.PDF#page=36&seqNum=66',
    date '2026-04-15',
    date '2025-08-21',
    'TLO 89(2) HB 23 history publishes 04/15/2026 for a DAY05C journal statement; all other 89C2DAY05CFINAL actions are 08/21/2025.',
    timestamptz '2026-08-29 15:26:02.011481+00'
  ),
  (
    'http://journals.house.texas.gov/hjrnl/892/pdf/89C2DAY05CFINAL.PDF#page=37&seqNum=66',
    date '2026-04-15',
    date '2025-08-21',
    'TLO 89(2) HB 22 history publishes 04/15/2026 for a DAY05C journal statement; all other 89C2DAY05CFINAL actions are 08/21/2025.',
    timestamptz '2026-08-29 15:26:02.011481+00'
  )
on conflict (source_url) do update
set published_action_date=excluded.published_action_date,
    corrected_action_date=excluded.corrected_action_date,
    reason=excluded.reason,
    verified_at=excluded.verified_at;
