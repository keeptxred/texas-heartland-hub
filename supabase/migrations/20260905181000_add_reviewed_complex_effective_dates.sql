-- Add provision-level schedules for additional reviewed 89(R) laws with multiple operative dates.
with seed(bill_identifier, sequence, provision_scope, effect_kind, effective_date, condition_text, condition_status, source_url, source_note) as (
  values
  ('HB 140', 1, 'Act generally', 'effective', date '2025-09-01', null, 'not_applicable', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/HB00140F.htm', 'Enrolled Section 8.'),
  ('HB 140', 2, 'Human Resources Code provisions repealed by Section 7', 'effective', date '2026-09-01', null, 'not_applicable', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/HB00140F.htm', 'Enrolled Section 7 makes the listed repeals effective September 1, 2026.'),

  ('HB 2789', 1, 'Act generally', 'effective', date '2025-09-01', null, 'not_applicable', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/HB02789F.HTM', 'Enrolled Section 11(b).'),
  ('HB 2789', 2, 'Sections 3 and 4', 'effective', date '2026-01-01', null, 'not_applicable', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/HB02789F.HTM', 'Enrolled Section 11(a).'),

  ('HB 2844', 1, 'Section 437B.004, Health and Safety Code, as added by the Act', 'effective', date '2025-09-01', null, 'not_applicable', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/HB02844F.HTM', 'Enrolled Section 6(b).'),
  ('HB 2844', 2, 'Act generally', 'effective', date '2026-07-01', null, 'not_applicable', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/HB02844F.HTM', 'Enrolled Section 6(a).'),

  ('SB 293', 1, 'Section 30', 'effective', date '2025-06-20', null, 'not_applicable', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/SB00293F.htm', 'Enrolled Section 36 provides immediate effect if the Act receives the required two-thirds vote; the enrolled vote totals satisfy that requirement.'),
  ('SB 293', 2, 'Act generally', 'effective', date '2025-09-01', null, 'not_applicable', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/SB00293F.htm', 'Enrolled Section 37 and TLO Stage 7.'),

  ('SB 1150', 1, 'Act generally', 'effective', date '2025-09-01', null, 'not_applicable', 'https://capitol.texas.gov/billlookup/BillStages.aspx?Bill=SB1150&LegSess=89R', 'TLO Stage 7.'),
  ('SB 1150', 2, 'Section 1', 'effective', date '2027-09-01', null, 'not_applicable', 'https://capitol.texas.gov/billlookup/BillStages.aspx?Bill=SB1150&LegSess=89R', 'TLO Stage 7 explicitly delays Section 1 until September 1, 2027.')
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
