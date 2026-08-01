-- Reconcile normalized authority records from bill data already imported
-- before the resumable ingestion path was available.

insert into public.legislative_sessions
  (legislature_number, session_code, session_name, session_type, is_current, source_url)
select distinct
  bill.legislature_number,
  bill.session_code,
  bill.legislature_number::text || 'th Texas Legislature ' ||
    case when bill.session_code = 'R' then 'Regular Session' else bill.session_code end,
  case when bill.session_code = 'R' then 'regular' else 'special' end,
  bill.legislature_number = (select max(legislature_number) from public.bills),
  'ftp://ftp.legis.state.tx.us/bills/' || bill.legislature_number::text || bill.session_code || '/'
from public.bills bill
on conflict (legislature_number, session_code) do update set
  session_name = excluded.session_name,
  session_type = excluded.session_type,
  is_current = excluded.is_current,
  source_url = excluded.source_url,
  updated_at = now();

with normalized as (
  select distinct on (
    bill.legislature_number,
    bill.session_code,
    coalesce(history.chamber, bill.chamber),
    trim(both '-' from lower(regexp_replace(replace(history.committee_name, '&', ' and '), '[^a-zA-Z0-9]+', '-', 'g')))
  )
    bill.legislature_number,
    bill.session_code,
    coalesce(history.chamber, bill.chamber) as chamber,
    history.committee_name,
    trim(both '-' from lower(regexp_replace(replace(history.committee_name, '&', ' and '), '[^a-zA-Z0-9]+', '-', 'g'))) as committee_slug,
    history.source_url
  from public.bill_committee_history history
  join public.bills bill on bill.id = history.bill_id
  where nullif(trim(history.committee_name), '') is not null
  order by bill.legislature_number, bill.session_code, coalesce(history.chamber, bill.chamber), committee_slug, history.sequence
)
insert into public.legislative_committees
  (legislature_number, session_code, chamber, committee_name, committee_slug, source_url)
select legislature_number, session_code, chamber, committee_name, committee_slug, source_url
from normalized
on conflict (legislature_number, session_code, chamber, committee_slug) do update set
  committee_name = excluded.committee_name,
  source_url = coalesce(excluded.source_url, legislative_committees.source_url),
  updated_at = now();

update public.bill_committee_history history
set committee_id = committee.id,
    updated_at = now()
from public.bills bill
join public.legislative_committees committee
  on committee.legislature_number = bill.legislature_number
 and committee.session_code = bill.session_code
where bill.id = history.bill_id
  and committee.chamber = coalesce(history.chamber, bill.chamber)
  and committee.committee_slug = trim(both '-' from lower(regexp_replace(replace(history.committee_name, '&', ' and '), '[^a-zA-Z0-9]+', '-', 'g')))
  and history.committee_id is distinct from committee.id;

select public.refresh_legislative_authority_graph();
