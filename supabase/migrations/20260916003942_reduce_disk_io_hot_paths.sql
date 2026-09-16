-- Reduce sustained disk IO on the public bill directory and bound the
-- 89th-Legislature sponsor normalization safety sweep to rows that actually
-- need canonicalization.

create index if not exists bills_active_last_action_idx
  on public.bills (last_action_date desc nulls last, id)
  where is_active = true;

create index if not exists bills_active_legislature_last_action_idx
  on public.bills (legislature_number, last_action_date desc nulls last, id)
  where is_active = true;

create index if not exists bills_active_chamber_last_action_idx
  on public.bills (chamber, last_action_date desc nulls last, id)
  where is_active = true;

create index if not exists bills_active_status_last_action_idx
  on public.bills (current_status_code, last_action_date desc nulls last, id)
  where is_active = true;

-- Added during the live production migration and immediately evaluated against
-- the real workload. A follow-up migration removes this index after EXPLAIN
-- showed it regressed the wide 1,000-row normalization read.
create index if not exists texas_news_feed_created_at_idx
  on public.texas_news_feed (created_at desc);

create or replace function public.list_89th_bill_sponsor_normalization_candidates()
returns table(sponsor_name text, chamber text)
language sql
stable
security definer
set search_path = public, private, pg_temp
as $$
  select distinct
    bs.sponsor_name,
    lower(btrim(bs.chamber)) as chamber
  from public.bill_sponsors bs
  join public.bills b
    on b.id = bs.bill_id
  left join private.bill_sponsor_identity_aliases a
    on a.chamber = lower(btrim(bs.chamber))
   and lower(btrim(a.alias_name)) = lower(btrim(bs.sponsor_name))
  where b.legislature_number = 89
    and lower(btrim(bs.chamber)) in ('house', 'senate')
    and (
      a.alias_name is null
      or bs.sponsor_name is distinct from a.canonical_name
      or bs.sponsor_slug is distinct from a.canonical_slug
      or lower(btrim(bs.chamber)) is distinct from a.chamber
      or bs.district is distinct from a.district
      or bs.external_legislator_id is distinct from a.external_legislator_id
    )
  order by chamber, sponsor_name;
$$;

revoke all on function public.list_89th_bill_sponsor_normalization_candidates() from public, anon, authenticated;
grant execute on function public.list_89th_bill_sponsor_normalization_candidates() to service_role;
