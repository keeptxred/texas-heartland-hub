-- Add reviewed 89(R) effective-date schedules for four additional laws.
-- Bill IDs are resolved from stable legislative identity rather than hardcoded UUIDs.

with target as (
  select id, bill_identifier
  from public.bills
  where legislature_number = 89
    and session_code = 'R'
    and bill_identifier in ('HB 3810','SB 1738','SB 1786','SB 2361')
), rows(bill_identifier, sequence, provision_scope, effect_kind, effective_date, condition_text, condition_status, source_url, source_note) as (
  values
    ('HB 3810', 1, 'Act generally', 'effective', date '2025-06-20', null, 'not_applicable', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/HB03810F.htm', 'Enrolled Section 4; House 133-0 and Senate 31-0 satisfied the immediate-effect threshold.'),
    ('HB 3810', 2, 'Rose City Municipal Utility District dissolution and director terms', 'effective', date '2025-08-19', null, 'not_applicable', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/HB03810F.htm', 'Section 1(b): effective on the 60th day after the Act effective date.'),
    ('HB 3810', 3, 'Repeal of Special District Local Laws Code Chapter 7958', 'effective', date '2025-08-20', null, 'not_applicable', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/HB03810F.htm', 'Section 2: effective on the 61st day after the Act effective date.'),
    ('SB 1738', 1, 'Section 5', 'effective', date '2025-05-15', 'Two-thirds vote required for immediate effect; Senate passed 31-0 and House passed 141-0.', 'satisfied', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/SB01738F.HTM', 'Enrolled Sections 7-8.'),
    ('SB 1738', 2, 'Act except Section 5', 'effective', date '2025-09-01', null, 'not_applicable', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/SB01738F.HTM', 'Enrolled Section 8.'),
    ('SB 1786', 1, 'Act except Sections 7 and 8', 'effective', date '2025-05-27', 'Immediate-effect threshold satisfied.', 'satisfied', 'https://capitol.texas.gov/billlookup/BillStages.aspx?Bill=SB1786&LegSess=89R', 'Texas Legislature Online Stage 7 states the Act takes effect immediately except Sections 7 and 8.'),
    ('SB 1786', 2, 'Sections 7 and 8', 'effective', date '2025-09-01', null, 'not_applicable', 'https://capitol.texas.gov/billlookup/BillStages.aspx?Bill=SB1786&LegSess=89R', 'Texas Legislature Online Stage 7.'),
    ('SB 2361', 1, 'Section 7(b)(1)', 'effective', date '2025-05-27', 'Two-thirds vote required for immediate effect; enrolled vote certifications satisfy the threshold.', 'satisfied', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/SB02361F.HTM', 'Enrolled Section 24(b).'),
    ('SB 2361', 2, 'Act except Section 7(b)(1)', 'effective', date '2025-09-01', null, 'not_applicable', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/SB02361F.HTM', 'Enrolled Section 24(a).')
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

update public.bills b
set effective_date = date '2025-06-20'
where b.legislature_number = 89
  and b.session_code = 'R'
  and b.bill_identifier = 'HB 3810'
  and b.effective_date is null;
