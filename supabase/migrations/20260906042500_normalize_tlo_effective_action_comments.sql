-- Preserve the authoritative effective date when TLO's bill-history feed renders
-- the action description as dotted filler and places the real date in its Comment column.
-- HB 2963 is the discovered gap; its enrolled Act takes effect September 1, 2026.
update public.bills
set effective_date = date '2026-09-01',
    updated_at = now()
where legislature_number = 89
  and session_code = 'R'
  and bill_type = 'hb'
  and bill_number = 2963
  and effective_date is distinct from date '2026-09-01';

-- The 89th-Legislature dotted action rows are simple single-date bills and already
-- have curated core effective dates. Normalize the action text to the format consumed
-- by tlo_explicit_effective_date so future lifecycle refreshes remain self-healing.
update public.bill_actions a
set action_text = 'Effective on ' || to_char(b.effective_date, 'FMMM/FMDD/YYYY'),
    updated_at = now()
from public.bills b
where a.bill_id = b.id
  and b.legislature_number = 89
  and b.bill_type in ('hb', 'sb')
  and b.effective_date is not null
  and a.action_text ~* '^Effective on\s*(\.\s*)+$';