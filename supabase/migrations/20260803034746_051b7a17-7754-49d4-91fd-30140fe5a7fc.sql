-- Bill-level legislative document coverage for operational QA and UI readiness.
-- This view is additive and derives all values from bills + bill_documents.
create or replace view public.bill_document_completeness
with (security_invoker = true)
as
select
  b.id as bill_id,
  b.legislature_number,
  b.session_code,
  b.bill_type,
  b.bill_number,
  count(d.id)::integer as document_count,
  count(d.id) filter (where d.document_type = 'history')::integer as history_count,
  count(d.id) filter (where d.document_type = 'bill_text')::integer as bill_text_count,
  count(d.id) filter (where d.document_type = 'analysis')::integer as analysis_count,
  count(d.id) filter (where d.document_type = 'fiscal_note')::integer as fiscal_note_count,
  count(d.id) filter (where d.document_type = 'witness_list')::integer as witness_list_count,
  bool_or(d.document_type = 'history') as has_history,
  bool_or(d.document_type = 'bill_text') as has_bill_text,
  bool_or(d.document_type = 'analysis') as has_analysis,
  bool_or(d.document_type = 'fiscal_note') as has_fiscal_note,
  bool_or(d.document_type = 'witness_list') as has_witness_list,
  (
    (case when bool_or(d.document_type = 'history') then 20 else 0 end) +
    (case when bool_or(d.document_type = 'bill_text') then 20 else 0 end) +
    (case when bool_or(d.document_type = 'analysis') then 20 else 0 end) +
    (case when bool_or(d.document_type = 'fiscal_note') then 20 else 0 end) +
    (case when bool_or(d.document_type = 'witness_list') then 20 else 0 end)
  )::integer as completeness_score,
  max(d.last_imported_at) as latest_document_imported_at
from public.bills b
left join public.bill_documents d on d.bill_id = b.id
where b.legislature_number is not null
  and b.session_code is not null
group by b.id, b.legislature_number, b.session_code, b.bill_type, b.bill_number;

grant select on public.bill_document_completeness to anon, authenticated, service_role;

comment on view public.bill_document_completeness is
  'Per-bill coverage of official history, text, analysis, fiscal notes, and witness lists. Score is 20 points per available document category.';