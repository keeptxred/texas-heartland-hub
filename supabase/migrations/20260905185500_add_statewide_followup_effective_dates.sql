-- Add reviewed statewide effective-date schedules for HB 4488 and HB 5033.

with target as (
  select id, bill_identifier
  from public.bills
  where legislature_number = 89
    and session_code = 'R'
    and bill_identifier in ('HB 4488','HB 5033')
), rows(bill_identifier, sequence, provision_scope, effect_kind, effective_date, condition_text, condition_status, source_url, source_note) as (
  values
    ('HB 4488', 1, 'Act except Sections 13 through 15', 'effective', date '2025-06-20', 'Two-thirds vote required for immediate effect; final House concurrence was 108-27 and Senate passage was 29-2.', 'satisfied', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/HB04488F.HTM', 'Enrolled Section 17 and certified final vote totals.'),
    ('HB 4488', 2, 'Sections 13 through 15', 'effective', date '2025-09-01', null, 'not_applicable', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/HB04488F.HTM', 'Enrolled Sections 13, 14, and 15 expressly state September 1, 2025.'),
    ('HB 5033', 1, 'Act except Section 1', 'effective', date '2025-09-01', null, 'not_applicable', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/HB05033F.htm', 'Enrolled Section 2(a).'),
    ('HB 5033', 2, 'Section 1: authority not to implement or enforce vehicle emissions inspection requirements', 'conditional', null, 'Takes effect on the 30th day after qualifying federal legislation becomes law or a qualifying U.S. constitutional amendment is adopted; otherwise Section 1 has no effect.', 'pending', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/HB05033F.htm', 'Enrolled Section 2(b)-(c). EPA continues to list Texas vehicle inspection and maintenance requirements in the approved SIP as of 2026; no qualifying trigger is recorded here.')
)
insert into public.bill_effective_date_provisions (
  bill_id, sequence, provision_scope, effect_kind, effective_date,
  condition_text, condition_status, source_url, source_note
)
select t.id, r.sequence, r.provision_scope, r.effect_kind, r.effective_date,
       r.condition_text, r.condition_status, r.source_url, r.source_note
from rows r
join target t using (bill_identifier)
on conflict (bill_id, sequence) do update set
  provision_scope = excluded.provision_scope,
  effect_kind = excluded.effect_kind,
  effective_date = excluded.effective_date,
  condition_text = excluded.condition_text,
  condition_status = excluded.condition_status,
  source_url = excluded.source_url,
  source_note = excluded.source_note,
  updated_at = now();
