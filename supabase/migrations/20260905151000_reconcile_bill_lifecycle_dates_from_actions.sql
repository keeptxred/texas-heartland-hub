-- Reconcile bill lifecycle dates from the authoritative Texas Legislature action feed.
-- Only explicit effective-date actions are parsed. "See remarks" remains untouched because
-- those measures can be staggered, conditional, or otherwise too complex for a single date.

create or replace function public.tlo_explicit_effective_date(
  p_action_text text,
  p_action_date date
)
returns date
language plpgsql
immutable
set search_path = public
as $$
declare
  v_match text;
  v_month integer;
  v_day integer;
  v_year integer;
begin
  if p_action_text is null then
    return null;
  end if;

  if p_action_text ~* '^Effective immediately\s*$' then
    return p_action_date;
  end if;

  v_match := substring(p_action_text from '(?i)^Effective on\s+([0-9]{1,2}/[0-9]{1,2}/[0-9]{2,4})\s*$');
  if v_match is null then
    return null;
  end if;

  v_month := split_part(v_match, '/', 1)::integer;
  v_day := split_part(v_match, '/', 2)::integer;
  v_year := split_part(v_match, '/', 3)::integer;
  if v_year < 100 then
    v_year := 2000 + v_year;
  end if;

  return make_date(v_year, v_month, v_day);
exception
  when others then
    return null;
end;
$$;

create or replace function public.refresh_bill_lifecycle_dates_from_actions(p_bill_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  with derived as (
    select
      min(action_date) filter (where action_text ~* '^Sent to the Governor\s*$') as sent_to_governor_date,
      min(action_date) filter (where action_text ~* '^Signed by the Governor\s*$') as signed_date,
      min(action_date) filter (where action_text ~* '^Vetoed by the Governor') as vetoed_date,
      min(public.tlo_explicit_effective_date(action_text, action_date)) as effective_date,
      bool_or(action_text ~* '^(Signed by the Governor|Filed without signature|Effective (immediately|on ))') as became_law
    from public.bill_actions
    where bill_id = p_bill_id
  )
  update public.bills b
  set
    sent_to_governor_date = coalesce(d.sent_to_governor_date, b.sent_to_governor_date),
    signed_date = coalesce(d.signed_date, b.signed_date),
    vetoed_date = coalesce(d.vetoed_date, b.vetoed_date),
    effective_date = coalesce(d.effective_date, b.effective_date),
    became_law = b.became_law or coalesce(d.became_law, false)
  from derived d
  where b.id = p_bill_id;
$$;

revoke all on function public.refresh_bill_lifecycle_dates_from_actions(uuid) from public, anon, authenticated;
grant execute on function public.refresh_bill_lifecycle_dates_from_actions(uuid) to service_role, postgres;

create or replace function public.trg_refresh_bill_lifecycle_dates_from_actions()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.refresh_bill_lifecycle_dates_from_actions(coalesce(new.bill_id, old.bill_id));
  return coalesce(new, old);
end;
$$;

revoke all on function public.trg_refresh_bill_lifecycle_dates_from_actions() from public, anon, authenticated;
grant execute on function public.trg_refresh_bill_lifecycle_dates_from_actions() to service_role, postgres;

drop trigger if exists refresh_bill_lifecycle_dates_after_action on public.bill_actions;
create trigger refresh_bill_lifecycle_dates_after_action
after insert or update of action_date, action_text or delete
on public.bill_actions
for each row
execute function public.trg_refresh_bill_lifecycle_dates_from_actions();

-- Backfill existing rows in one set-based pass. Existing curated dates win whenever
-- the feed has no single explicit date (for example, "See remarks for effective date").
with derived as (
  select
    bill_id,
    min(action_date) filter (where action_text ~* '^Sent to the Governor\s*$') as sent_to_governor_date,
    min(action_date) filter (where action_text ~* '^Signed by the Governor\s*$') as signed_date,
    min(action_date) filter (where action_text ~* '^Vetoed by the Governor') as vetoed_date,
    min(public.tlo_explicit_effective_date(action_text, action_date)) as effective_date,
    bool_or(action_text ~* '^(Signed by the Governor|Filed without signature|Effective (immediately|on ))') as became_law
  from public.bill_actions
  group by bill_id
)
update public.bills b
set
  sent_to_governor_date = coalesce(d.sent_to_governor_date, b.sent_to_governor_date),
  signed_date = coalesce(d.signed_date, b.signed_date),
  vetoed_date = coalesce(d.vetoed_date, b.vetoed_date),
  effective_date = coalesce(d.effective_date, b.effective_date),
  became_law = b.became_law or coalesce(d.became_law, false)
from derived d
where b.id = d.bill_id;
