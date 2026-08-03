-- Correct Texas Legislature Online bill-text version codes for the 89th Regular Session.
-- The official PDF corpus identifies F as enrolled text and L as the Senate
-- amendments printing. Keep enrolled text latest when both versions exist.

update public.bill_documents
set
  version_label = 'Enrolled',
  version_sequence = 100,
  updated_at = now()
where legislature_number = 89
  and session_code = 'R'
  and document_type = 'bill_text'
  and version_code = 'F';

update public.bill_documents
set
  version_label = 'Senate amendments printing',
  version_sequence = 90,
  updated_at = now()
where legislature_number = 89
  and session_code = 'R'
  and document_type = 'bill_text'
  and version_code = 'L';

do $$
declare
  affected_bill_id uuid;
begin
  for affected_bill_id in
    select distinct bill_id
    from public.bill_documents
    where legislature_number = 89
      and session_code = 'R'
      and document_type = 'bill_text'
      and version_code in ('F', 'L')
  loop
    perform public.refresh_bill_document_latest_flags(affected_bill_id);
  end loop;
end;
$$;