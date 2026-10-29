-- Keep law-making status strictly on HB/SB. HCR/SCR/HR/SR/HJR/SJR are
-- resolutions (including proposed amendments), not enacted statutes.
-- This invariant applies to every writer, including legacy RSS imports.
create or replace function public.bills_statute_only_enactment_guard()
returns trigger language plpgsql security invoker set search_path = public, pg_temp as $$
begin
  if new.bill_type not in ('hb','sb') then
    new.became_law := false;
  end if;
  return new;
end;
$$;

drop trigger if exists bills_statute_only_enactment_guard on public.bills;
create trigger bills_statute_only_enactment_guard
before insert or update on public.bills
for each row execute function public.bills_statute_only_enactment_guard();

-- Preserve established statute lifecycle behavior without manufacturing law
-- statuses for resolution records when bill_actions triggers fire.
create or replace function public.refresh_bill_lifecycle_dates_from_actions(p_bill_id uuid)
returns void language sql security definer set search_path = public, pg_temp as $$
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
  where b.id = p_bill_id
    and b.bill_type in ('hb','sb');
$$;

revoke all on function public.bills_statute_only_enactment_guard() from public, anon, authenticated;
revoke all on function public.refresh_bill_lifecycle_dates_from_actions(uuid) from public, anon, authenticated;
comment on function public.bills_statute_only_enactment_guard() is
  'Guarantees that only HB/SB can be recorded as enacted laws; applies across every ingestion path.';
