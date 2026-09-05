-- Add reviewed conditional and staggered effective-date schedules from TLO Stage 7 records.
with seed(bill_identifier, sequence, provision_scope, effect_kind, effective_date, condition_text, condition_status, source_url, source_note) as (
  values
  ('HB 247', 1, 'Act', 'conditional', date '2026-01-01', 'Takes effect only if HJR 34 is approved by voters.', 'satisfied', 'https://capitol.texas.gov/billlookup/BillStages.aspx?Bill=HB247&LegSess=89R', 'HJR 34 appeared as Proposition 17 and was adopted November 4, 2025.'),
  ('HB 1399', 1, 'Act', 'conditional', date '2026-01-01', 'Takes effect only if HJR 99 is approved by voters.', 'satisfied', 'https://capitol.texas.gov/billlookup/BillStages.aspx?Bill=HB1399&LegSess=89R', 'HJR 99 appeared as Proposition 5 and was adopted November 4, 2025.'),
  ('HB 2508', 1, 'Act', 'conditional', date '2026-01-01', 'Takes effect only if HJR 133 is approved by voters.', 'satisfied', 'https://capitol.texas.gov/billlookup/BillStages.aspx?Bill=HB2508&LegSess=89R', 'HJR 133 appeared as Proposition 7 and was adopted November 4, 2025.'),
  ('SB 467', 1, 'Act', 'conditional', date '2026-01-01', 'Takes effect only if SJR 84 is approved by voters.', 'satisfied', 'https://capitol.texas.gov/billlookup/BillStages.aspx?Bill=SB467&LegSess=89R', 'SJR 84 appeared as Proposition 10 and was adopted November 4, 2025.'),
  ('SB 2155', 1, 'Act generally', 'effective', date '2025-09-01', null, 'not_applicable', 'https://capitol.texas.gov/billlookup/BillStages.aspx?Bill=SB2155&LegSess=89R', 'TLO Stage 7.'),
  ('SB 2155', 2, 'Section 37', 'effective', date '2026-09-01', null, 'not_applicable', 'https://capitol.texas.gov/billlookup/BillStages.aspx?Bill=SB2155&LegSess=89R', 'TLO Stage 7.')
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

-- These measures have one operative date and their constitutional conditions were satisfied.
update public.bills
set effective_date = case bill_identifier
  when 'HB 9' then date '2026-01-01'
  when 'HB 247' then date '2026-01-01'
  when 'HB 1399' then date '2026-01-01'
  when 'HB 2508' then date '2026-01-01'
  when 'SB 467' then date '2026-01-01'
  when 'SB 5' then date '2025-12-01'
  else effective_date
end
where legislature_number = 89
  and session_code = 'R'
  and bill_identifier in ('HB 9','HB 247','HB 1399','HB 2508','SB 467','SB 5');
