-- Represent staggered, conditional, and no-effect provisions without flattening them into bills.effective_date.
create table if not exists public.bill_effective_date_provisions (
  id uuid primary key default gen_random_uuid(),
  bill_id uuid not null references public.bills(id) on delete cascade,
  sequence smallint not null default 0,
  provision_scope text not null,
  effect_kind text not null default 'effective' check (effect_kind in ('effective','conditional','no_effect')),
  effective_date date,
  condition_text text,
  condition_status text not null default 'not_applicable' check (condition_status in ('not_applicable','pending','satisfied','failed','unknown')),
  source_url text not null,
  source_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bill_effective_date_provisions_sequence_unique unique (bill_id, sequence),
  constraint bill_effective_date_provisions_effect_shape check (
    (effect_kind = 'no_effect' and effective_date is null)
    or effect_kind in ('effective','conditional')
  )
);

create index if not exists bill_effective_date_provisions_bill_id_idx
  on public.bill_effective_date_provisions (bill_id, sequence);

alter table public.bill_effective_date_provisions enable row level security;

drop policy if exists "Public can read bill effective-date provisions" on public.bill_effective_date_provisions;
create policy "Public can read bill effective-date provisions"
on public.bill_effective_date_provisions
for select
to anon, authenticated
using (true);

grant select on public.bill_effective_date_provisions to anon, authenticated;
grant select, insert, update, delete on public.bill_effective_date_provisions to service_role;

-- Seed reviewed 89(R) complex effective-date records from official TLO history/stages.
with seed(bill_identifier, sequence, provision_scope, effect_kind, effective_date, condition_text, condition_status, source_url, source_note) as (
  values
  ('HB 2', 1, 'Articles 1-6, except provisions separately delayed below', 'effective', date '2025-06-20', null, 'not_applicable', 'https://capitol.texas.gov/billlookup/History.aspx?Bill=HB2&LegSess=89R', 'TLO remarks: Articles 1-6 take effect immediately.'),
  ('HB 2', 2, 'Sections 1.07, 1.08, 1.09, 4.57-4.60, 4.62, 5.24-5.27, and 6.13-6.21; Article 7 generally', 'effective', date '2025-09-01', null, 'not_applicable', 'https://capitol.texas.gov/billlookup/History.aspx?Bill=HB2&LegSess=89R', 'TLO enrolled-stage effective-date schedule.'),
  ('HB 2', 3, 'Section 48.112(c)-(d) as amended by Article 1; Sections 2.18, 2.19, 2.20(b), 4.53-4.56, 4.61, and 5.28', 'effective', date '2026-09-01', null, 'not_applicable', 'https://capitol.texas.gov/billlookup/History.aspx?Bill=HB2&LegSess=89R', 'TLO enrolled-stage effective-date schedule.'),
  ('HB 2', 4, 'Section 29.1543(b), Education Code, as added by Article 5', 'effective', date '2027-09-01', null, 'not_applicable', 'https://capitol.texas.gov/billlookup/History.aspx?Bill=HB2&LegSess=89R', 'TLO enrolled-stage effective-date schedule.'),
  ('HB 2', 5, 'Section 5.19', 'effective', date '2028-09-01', null, 'not_applicable', 'https://capitol.texas.gov/billlookup/History.aspx?Bill=HB2&LegSess=89R', 'TLO enrolled-stage effective-date schedule.'),
  ('HB 2', 6, 'Section 6.23', 'no_effect', null, null, 'not_applicable', 'https://capitol.texas.gov/billlookup/History.aspx?Bill=HB2&LegSess=89R', 'TLO remarks state Section 6.23 has no effect.'),

  ('HB 120', 1, 'Act generally', 'effective', date '2025-06-20', null, 'not_applicable', 'https://capitol.texas.gov/billlookup/History.aspx?Bill=HB120&LegSess=89R', 'TLO remarks: Act takes effect immediately.'),
  ('HB 120', 2, 'Sections 13-21', 'effective', date '2025-09-01', null, 'not_applicable', 'https://capitol.texas.gov/billlookup/History.aspx?Bill=HB120&LegSess=89R', 'TLO remarks.'),
  ('HB 120', 3, 'Section 23', 'no_effect', null, null, 'not_applicable', 'https://capitol.texas.gov/billlookup/History.aspx?Bill=HB120&LegSess=89R', 'TLO remarks state Section 23 has no effect.'),

  ('SB 7', 1, 'Act generally', 'effective', date '2025-09-01', null, 'not_applicable', 'https://capitol.texas.gov/billlookup/History.aspx?Bill=SB7&LegSess=89R', 'TLO remarks.'),
  ('SB 7', 2, 'Sections 1.04, 1.06, and 1.09', 'conditional', date '2027-09-01', 'Takes effect only if HJR 7 is approved by voters.', 'satisfied', 'https://capitol.texas.gov/billlookup/History.aspx?Bill=SB7&LegSess=89R', 'HJR 7 appeared as Proposition 4 and was adopted in the November 4, 2025 constitutional amendment election.'),

  ('SB 9', 1, 'Act generally', 'effective', date '2025-09-01', null, 'not_applicable', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/SB00009F.HTM', 'Enrolled Section 22(a).'),
  ('SB 9', 2, 'Article 16.24; Articles 17.021(c-1),(h),(h-1); Articles 17.027(c)-(d); Section 72.038(c-1)', 'effective', date '2026-01-01', null, 'not_applicable', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/SB00009F.HTM', 'Enrolled Section 22(b).'),
  ('SB 9', 3, 'Article 17.021(b); Article 17.027(a) and (a-1)', 'effective', date '2026-04-01', null, 'not_applicable', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/SB00009F.HTM', 'Enrolled Section 22(c).'),
  ('SB 9', 4, 'Section 4', 'conditional', date '2026-01-01', 'Takes effect only if the corresponding constitutional amendment requiring denial of bail in specified felony cases is approved by voters.', 'satisfied', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/SB00009F.HTM', 'Enrolled Section 22(d); the 2025 constitutional amendments were adopted.'),

  ('SB 38', 1, 'Section 16 (Supreme Court rulemaking)', 'effective', date '2025-09-01', null, 'not_applicable', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/SB00038F.htm', 'Enrolled Section 18(b).'),
  ('SB 38', 2, 'Act generally; changes apply to eviction petitions filed on or after this date', 'effective', date '2026-01-01', null, 'not_applicable', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/SB00038F.htm', 'Enrolled Sections 17-18.'),

  ('SB 568', 1, 'Act generally, except Chapter 48 provisions listed below', 'effective', date '2025-06-20', null, 'not_applicable', 'https://capitol.texas.gov/billlookup/BillStages.aspx?Bill=SB568&LegSess=89R', 'TLO Stage 7: Act takes effect immediately.'),
  ('SB 568', 2, 'Sections 58, 59, 60, 61, and 63 / applicable Chapter 48 amendments', 'effective', date '2025-09-01', null, 'not_applicable', 'https://capitol.texas.gov/billlookup/BillStages.aspx?Bill=SB568&LegSess=89R', 'TLO Stage 7.'),
  ('SB 568', 3, 'Sections 53-57 and 62 / specified Chapter 48 provisions', 'effective', date '2026-09-01', null, 'not_applicable', 'https://capitol.texas.gov/billlookup/BillStages.aspx?Bill=SB568&LegSess=89R', 'TLO Stage 7.'),

  ('HB 1393', 1, 'Act', 'conditional', date '2025-09-01', 'Takes effect only if federal law authorizes Texas to observe daylight saving time year-round; otherwise the Act has no effect.', 'pending', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/HB01393F.htm', 'Enrolled Section 2.'),

  ('SB 5', 1, 'Act', 'conditional', date '2025-12-01', 'Takes effect only if the constitutional amendment proposed by SJR 3 is approved by voters.', 'satisfied', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/SB00005F.HTM', 'Proposition 14 (SJR 3) was adopted November 4, 2025.'),

  ('SB 4', 1, 'Act generally, except Article 1', 'effective', date '2025-06-16', null, 'not_applicable', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/SB00004F.HTM', 'Enrolled Article 3; bill received the vote required for immediate effect.'),
  ('SB 4', 2, 'Article 1', 'conditional', null, 'Takes effect on the date the SJR 2 constitutional amendment takes effect; no effect if voters reject the amendment.', 'satisfied', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/SB00004F.HTM', 'SJR 2 appeared as Proposition 13 and was adopted November 4, 2025.'),

  ('SB 23', 1, 'Act generally, except Article 1', 'effective', date '2025-06-16', null, 'not_applicable', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/SB00023F.htm', 'TLO summary states the bill generally took effect June 16, 2025.'),
  ('SB 23', 2, 'Article 1', 'conditional', null, 'Takes effect on the date the SJR 85 constitutional amendment takes effect; no effect if voters reject the amendment.', 'satisfied', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/SB00023F.htm', 'SJR 85 appeared as Proposition 11 and was adopted November 4, 2025.'),

  ('HB 9', 1, 'Act', 'conditional', date '2026-01-01', 'Takes effect only if the constitutional amendment proposed by HJR 1 is approved by voters.', 'satisfied', 'https://capitol.texas.gov/billlookup/History.aspx?Bill=HB9&LegSess=89R', 'HJR 1 appeared as Proposition 9 and was adopted November 4, 2025.')
), target as (
  select b.id, s.*
  from seed s
  join public.bills b
    on b.legislature_number = 89
   and b.session_code = 'R'
   and b.bill_identifier = s.bill_identifier
)
insert into public.bill_effective_date_provisions
  (bill_id, sequence, provision_scope, effect_kind, effective_date, condition_text, condition_status, source_url, source_note)
select id, sequence, provision_scope, effect_kind, effective_date, condition_text, condition_status, source_url, source_note
from target
on conflict (bill_id, sequence) do update set
  provision_scope = excluded.provision_scope,
  effect_kind = excluded.effect_kind,
  effective_date = excluded.effective_date,
  condition_text = excluded.condition_text,
  condition_status = excluded.condition_status,
  source_url = excluded.source_url,
  source_note = excluded.source_note,
  updated_at = now();
