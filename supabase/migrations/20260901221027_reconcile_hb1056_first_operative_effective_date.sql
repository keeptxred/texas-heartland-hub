update public.bills
set effective_date = date '2026-09-01',
    updated_at = greatest(updated_at, now())
where legislature_number = 89
  and session_code = 'R'
  and bill_type = 'hb'
  and bill_number = 1056
  and effective_date is distinct from date '2026-09-01';
