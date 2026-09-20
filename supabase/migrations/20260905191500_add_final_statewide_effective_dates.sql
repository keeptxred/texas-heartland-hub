-- Add reviewed structured effective-date schedules for the final statewide 89(R)
-- "See remarks for effective date" measures not already represented.

with target as (
  select id, bill_identifier
  from public.bills
  where legislature_number = 89
    and session_code = 'R'
    and bill_identifier in ('HB 3250','HB 3689','SB 1036','SB 22')
), rows(bill_identifier, sequence, provision_scope, effect_kind, effective_date, condition_text, condition_status, source_url, source_note) as (
  values
    ('HB 3250', 1, 'Section 1103.164 stipend program', 'effective', date '2025-06-20', 'Two-thirds vote required for immediate effect; final House concurrence was 101 votes and Senate passage was 30-1.', 'satisfied', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/HB03250F.htm', 'Enrolled effective-date clause and certified vote totals.'),
    ('HB 3250', 2, 'Act except Section 1103.164', 'effective', date '2025-09-01', null, 'not_applicable', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/HB03250F.htm', 'Enrolled effective-date clause.'),
    ('HB 3689', 1, 'Act except provisions expressly delayed to September 1, 2027', 'effective', date '2025-09-01', null, 'not_applicable', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/HB03689F.htm', 'Enrolled Article 4 general effective-date clause.'),
    ('HB 3689', 2, 'Provisions expressly delayed to September 1, 2027, including transition, repeal, and conforming TWIA provisions', 'effective', date '2027-09-01', null, 'not_applicable', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/HB03689F.htm', 'Enrolled Sections 1.17 and multiple Article 2 provisions expressly use September 1, 2027.'),
    ('SB 1036', 1, 'Act except Sections 1806.101, 1806.102, and Subchapter E of Chapter 1806', 'effective', date '2025-09-01', null, 'not_applicable', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/SB01036F.htm', 'Enrolled effective-date clause.'),
    ('SB 1036', 2, 'Sections 1806.101, 1806.102, and Subchapter E of Chapter 1806', 'effective', date '2026-09-01', null, 'not_applicable', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/SB01036F.htm', 'Enrolled delayed-registration effective-date clause.'),
    ('SB 22', 1, 'Act except later sunset-transition provisions', 'effective', date '2025-09-01', null, 'not_applicable', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/SB00022F.htm', 'Enrolled general effective-date clause.'),
    ('SB 22', 2, 'Temporary Article 2 provisions and Texas moving image industry incentive fund expire or are abolished August 31, 2035', 'no_effect', null, null, 'not_applicable', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/SB00022F.htm', 'Enrolled Article 2 expressly provides for expiration or abolition on August 31, 2035.'),
    ('SB 22', 3, 'Article 3 replacement and sunset statutory amendments', 'effective', date '2035-09-01', null, 'not_applicable', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/SB00022F.htm', 'Enrolled Article 3 provisions take effect September 1, 2035.')
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
