-- Unified official legislative document model for TLO bill text, analyses,
-- fiscal notes, witness lists, and report indexes.
-- Additive migration: existing bill rows and bill_documents URLs are preserved.
alter table public.bill_documents
  add column if not exists source_key text not null default 'texas-legislature-online',
  add column if not exists source_record_key text,
  add column if not exists legislature_number integer,
  add column if not exists session_code text,
  add column if not exists bill_type text,
  add column if not exists bill_number integer,
  add column if not exists version_code text,
  add column if not exists version_sequence integer,
  add column if not exists is_latest boolean not null default false,
  add column if not exists source_html_url text,
  add column if not exists source_pdf_url text,
  add column if not exists storage_path text,
  add column if not exists content_hash text,
  add column if not exists extracted_text text,
  add column if not exists extracted_text_hash text,
  add column if not exists metadata jsonb not null default '{}'::jsonb,
  add column if not exists last_seen_at timestamptz not null default now(),
  add column if not exists last_imported_at timestamptz;

update public.bill_documents d
set legislature_number = b.legislature_number,
    session_code = b.session_code,
    bill_type = b.bill_type,
    bill_number = b.bill_number,
    source_record_key = coalesce(d.source_record_key, d.document_url)
from public.bills b
where d.bill_id = b.id
  and (d.legislature_number is null or d.session_code is null or d.bill_type is null or d.bill_number is null or d.source_record_key is null);

-- PostgREST's on_conflict=source_key,source_record_key requires an unconditional
-- unique index that PostgreSQL can infer without a partial-index predicate.
alter table public.bill_documents
  alter column source_record_key set not null;

drop index if exists public.bill_documents_source_record_uidx;

create unique index bill_documents_source_record_uidx
  on public.bill_documents (source_key, source_record_key);

create index if not exists bill_documents_bill_type_version_idx
  on public.bill_documents (bill_id, document_type, version_sequence desc nulls last, document_date desc nulls last);

create index if not exists bill_documents_identity_idx
  on public.bill_documents (legislature_number, session_code, bill_type, bill_number, document_type);

create index if not exists bill_documents_latest_idx
  on public.bill_documents (bill_id, document_type)
  where is_latest;

create index if not exists bill_documents_extracted_text_fts_idx
  on public.bill_documents using gin (to_tsvector('english', coalesce(extracted_text, '')));

create table if not exists public.legislative_report_indexes (
  id uuid primary key default gen_random_uuid(),
  source_key text not null default 'texas-legislature-online',
  source_record_key text not null,
  legislature_number integer not null,
  session_code text not null,
  report_type text not null,
  report_key text,
  report_title text not null,
  source_url text not null,
  content_hash text not null,
  extracted_text text,
  metadata jsonb not null default '{}'::jsonb,
  last_seen_at timestamptz not null default now(),
  last_imported_at timestamptz not null default now(),
  unique (source_key, source_record_key)
);

create index if not exists legislative_report_indexes_lookup_idx
  on public.legislative_report_indexes (legislature_number, session_code, report_type, report_key);

create index if not exists legislative_report_indexes_fts_idx
  on public.legislative_report_indexes using gin (to_tsvector('english', coalesce(extracted_text, '')));

alter table public.legislative_report_indexes enable row level security;

drop policy if exists "Public read legislative_report_indexes" on public.legislative_report_indexes;

create policy "Public read legislative_report_indexes"
  on public.legislative_report_indexes for select using (true);

grant select on public.bill_documents, public.legislative_report_indexes to anon, authenticated;

grant all on public.bill_documents, public.legislative_report_indexes to service_role;

create or replace function public.refresh_bill_document_latest_flags(p_bill_id uuid default null)
returns void
language sql
security definer
set search_path = public
as $$
  with ranked as (
    select id,
      row_number() over (
        partition by bill_id, document_type
        order by version_sequence desc nulls last, document_date desc nulls last, updated_at desc, id desc
      ) as rn
    from public.bill_documents
    where p_bill_id is null or bill_id = p_bill_id
  )
  update public.bill_documents d
  set is_latest = (ranked.rn = 1), updated_at = now()
  from ranked
  where d.id = ranked.id and d.is_latest is distinct from (ranked.rn = 1)
$$;

grant execute on function public.refresh_bill_document_latest_flags(uuid) to service_role;

comment on table public.bill_documents is 'Official per-bill documents and versions. Parsed HTML text is stored for search; PDFs remain external or in object storage.';

comment on table public.legislative_report_indexes is 'Official TLO session-level indexes such as author, sponsor, committee, filed-date, and effective-date reports.';