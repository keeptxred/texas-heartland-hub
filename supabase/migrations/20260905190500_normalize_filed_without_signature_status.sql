-- Normalize bills that become law after being filed without the governor's signature.
-- TLO uses both "Filed without signature" and "Filed without the Governor's signature" variants.

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
      bool_or(action_text ~* '^(Signed by the Governor|Filed without (the Governor''s )?signature|Effective (immediately|on ))') as became_law,
      bool_or(action_text ~* '^Filed without (the Governor''s )?signature\s*$') as filed_without_signature
    from public.bill_actions
    where bill_id = p_bill_id
  )
  update public.bills b
  set
    sent_to_governor_date = coalesce(d.sent_to_governor_date, b.sent_to_governor_date),
    signed_date = coalesce(d.signed_date, b.signed_date),
    vetoed_date = coalesce(d.vetoed_date, b.vetoed_date),
    effective_date = coalesce(d.effective_date, b.effective_date),
    became_law = b.became_law or coalesce(d.became_law, false),
    current_status_code = case
      when coalesce(d.filed_without_signature, false)
       and b.current_status_code not in ('vetoed','signed','became-law') then 'became-law'
      else b.current_status_code
    end,
    current_status_label = case
      when coalesce(d.filed_without_signature, false)
       and b.current_status_code not in ('vetoed','signed','became-law') then 'Became law'
      else b.current_status_label
    end,
    current_status_description = case
      when coalesce(d.filed_without_signature, false)
       and b.current_status_code not in ('vetoed','signed','became-law') then 'Filed without the Governor''s signature'
      else b.current_status_description
    end
  from derived d
  where b.id = p_bill_id;
$$;

revoke all on function public.refresh_bill_lifecycle_dates_from_actions(uuid) from public, anon, authenticated;
grant execute on function public.refresh_bill_lifecycle_dates_from_actions(uuid) to service_role, postgres;

with affected as (
  select distinct bill_id
  from public.bill_actions
  where action_text ~* '^Filed without (the Governor''s )?signature\s*$'
)
select public.refresh_bill_lifecycle_dates_from_actions(bill_id)
from affected;
