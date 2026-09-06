-- Preserve the enrolled two-stage effective-date schedule for 89(R) HB 1056.
-- Section 2116.101 (legal tender) begins September 1, 2026; the remainder,
-- including the electronic transactional currency framework, begins May 1, 2027.

with target as (
  select id
  from public.bills
  where legislature_number = 89
    and session_code = 'R'
    and bill_type = 'hb'
    and bill_number = 1056
), rows(sequence, provision_scope, effect_kind, effective_date, condition_text, condition_status, source_url, source_note) as (
  values
    (
      1,
      'Section 2116.101, Government Code (gold and silver specie legal-tender provision)',
      'effective',
      date '2026-09-01',
      null,
      'not_applicable',
      'https://capitol.texas.gov/tlodocs/89R/billtext/html/HB01056F.HTM',
      'Enrolled Section 2(b) expressly makes Section 2116.101 effective September 1, 2026.'
    ),
    (
      2,
      'Act except Section 2116.101, including the electronic transactional currency framework',
      'effective',
      date '2027-05-01',
      null,
      'not_applicable',
      'https://capitol.texas.gov/tlodocs/89R/billtext/html/HB01056F.HTM',
      'Enrolled Section 2(a) provides May 1, 2027 as the general effective date.'
    )
)
insert into public.bill_effective_date_provisions (
  bill_id, sequence, provision_scope, effect_kind, effective_date,
  condition_text, condition_status, source_url, source_note
)
select target.id, rows.sequence, rows.provision_scope, rows.effect_kind, rows.effective_date,
       rows.condition_text, rows.condition_status, rows.source_url, rows.source_note
from target
cross join rows
on conflict (bill_id, sequence) do update set
  provision_scope = excluded.provision_scope,
  effect_kind = excluded.effect_kind,
  effective_date = excluded.effective_date,
  condition_text = excluded.condition_text,
  condition_status = excluded.condition_status,
  source_url = excluded.source_url,
  source_note = excluded.source_note,
  updated_at = now();
