create or replace function public.refresh_bill_lifecycle_dates_from_actions(p_bill_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  with derived as (
    select
      min(action_date) filter (where action_text ~* '^Sent to the Governor\s*$') as sent_to_governor_date,
      min(action_date) filter (where action_text ~* '^Signed by the Governor(?:/line item veto)?\s*$') as signed_date,
      min(action_date) filter (where action_text ~* '^Vetoed by the Governor') as vetoed_date,
      min(public.tlo_explicit_effective_date(action_text, action_date)) as effective_date,
      bool_or(action_text ~* '^(Signed by the Governor(?:/line item veto)?|Filed without (the Governor''s )?signature|Effective (immediately|on ))') as became_law,
      bool_or(action_text ~* '^Filed without (the Governor''s )?signature\s*$') as filed_without_signature,
      bool_or(action_text ~* '^Signed by the Governor/line item veto\s*$') as line_item_veto
    from public.bill_actions
    where bill_id = p_bill_id
  )
  update public.bills b
  set
    sent_to_governor_date = coalesce(d.sent_to_governor_date, b.sent_to_governor_date),
    signed_date = coalesce(d.signed_date, b.signed_date),
    vetoed_date = case when coalesce(d.line_item_veto, false) then null else coalesce(d.vetoed_date, b.vetoed_date) end,
    effective_date = coalesce(d.effective_date, b.effective_date),
    became_law = b.became_law or coalesce(d.became_law, false),
    current_status_code = case
      when coalesce(d.line_item_veto, false) and coalesce(d.effective_date, b.effective_date) is not null then 'effective'
      when coalesce(d.line_item_veto, false) then 'signed'
      when coalesce(d.filed_without_signature, false)
       and b.current_status_code not in ('vetoed','signed','became-law','effective') then 'became-law'
      else b.current_status_code
    end,
    current_status_label = case
      when coalesce(d.line_item_veto, false) and coalesce(d.effective_date, b.effective_date) is not null then 'Effective'
      when coalesce(d.line_item_veto, false) then 'Signed by governor'
      when coalesce(d.filed_without_signature, false)
       and b.current_status_code not in ('vetoed','signed','became-law','effective') then 'Became law'
      else b.current_status_label
    end,
    current_status_description = case
      when coalesce(d.line_item_veto, false) and coalesce(d.effective_date, b.effective_date) is not null then 'Effective; signed by the Governor with a line-item veto'
      when coalesce(d.line_item_veto, false) then 'Signed by the Governor with a line-item veto'
      when coalesce(d.filed_without_signature, false)
       and b.current_status_code not in ('vetoed','signed','became-law','effective') then 'Filed without the Governor''s signature'
      else b.current_status_description
    end
  from derived d
  where b.id = p_bill_id;
$$;

create or replace function public.preserve_line_item_veto_lifecycle()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_signed date;
  v_effective date;
  v_line_item boolean;
begin
  select
    min(action_date) filter (where action_text ~* '^Signed by the Governor/line item veto\s*$'),
    min(public.tlo_explicit_effective_date(action_text, action_date)),
    bool_or(action_text ~* '^Signed by the Governor/line item veto\s*$')
  into v_signed, v_effective, v_line_item
  from public.bill_actions
  where bill_id = new.id;

  if coalesce(v_line_item, false) then
    new.signed_date := coalesce(v_signed, new.signed_date);
    new.vetoed_date := null;
    new.effective_date := coalesce(v_effective, new.effective_date);
    new.became_law := true;
    if new.effective_date is not null then
      new.current_status_code := 'effective';
      new.current_status_label := 'Effective';
      new.current_status_description := 'Effective; signed by the Governor with a line-item veto';
    else
      new.current_status_code := 'signed';
      new.current_status_label := 'Signed by governor';
      new.current_status_description := 'Signed by the Governor with a line-item veto';
    end if;
  end if;

  return new;
end;
$$;

revoke all on function public.preserve_line_item_veto_lifecycle() from public, anon, authenticated;
grant execute on function public.preserve_line_item_veto_lifecycle() to service_role, postgres;

drop trigger if exists bills_preserve_line_item_veto_lifecycle on public.bills;
create trigger bills_preserve_line_item_veto_lifecycle
before update on public.bills
for each row
execute function public.preserve_line_item_veto_lifecycle();

select public.refresh_bill_lifecycle_dates_from_actions(id)
from public.bills
where legislature_number = 89 and session_code = 'R' and bill_identifier = 'HB 500';
