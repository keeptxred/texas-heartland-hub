-- Reviewed KeepTXRed explanations for official Texas bill records.
-- These rows are deliberately separate from official imported bill fields.

create table if not exists public.bill_editorial_enrichments (
  id uuid primary key default gen_random_uuid(),
  bill_id uuid not null unique references public.bills(id) on delete cascade,
  plain_language_summary text,
  what_changes text,
  who_is_affected text,
  effective_date_explanation text,
  limitations text,
  source_document_ids uuid[] not null default '{}',
  source_urls text[] not null default '{}',
  source_notes text,
  generation_method text not null default 'manual',
  model_name text,
  confidence numeric(4,3) check (confidence between 0 and 1),
  review_status text not null default 'draft'
    check (review_status in ('draft','pending','approved','rejected')),
  reviewed_by text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bill_editorial_has_source check (
    review_status <> 'approved'
    or cardinality(source_document_ids) > 0
    or cardinality(source_urls) > 0
  )
);

create index if not exists bill_editorial_review_idx
  on public.bill_editorial_enrichments (review_status, updated_at desc);

alter table public.bill_editorial_enrichments enable row level security;

drop policy if exists "Public read approved bill editorial enrichments"
  on public.bill_editorial_enrichments;
create policy "Public read approved bill editorial enrichments"
  on public.bill_editorial_enrichments
  for select
  using (review_status = 'approved');

create or replace function public.touch_bill_editorial_enrichment()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at := now();
  if new.review_status = 'approved' and old.review_status is distinct from 'approved' then
    new.reviewed_at := coalesce(new.reviewed_at, now());
  end if;
  return new;
end;
$$;

drop trigger if exists touch_bill_editorial_enrichment
  on public.bill_editorial_enrichments;
create trigger touch_bill_editorial_enrichment
before update on public.bill_editorial_enrichments
for each row execute function public.touch_bill_editorial_enrichment();

comment on table public.bill_editorial_enrichments is
  'Reviewed KeepTXRed explanations kept separate from official legislative data. Approved rows require at least one source document or URL.';
comment on column public.bill_editorial_enrichments.what_changes is
  'A sourced explanation of the substantive change proposed by the bill; not official legislative text.';
comment on column public.bill_editorial_enrichments.who_is_affected is
  'A sourced, reviewed description of likely affected people, organizations, or agencies; not legal advice.';