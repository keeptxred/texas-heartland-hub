create or replace function public.preserve_temporal_bill_effective_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_filed_without_signature boolean;
  v_signed_action boolean;
begin
  if coalesce(new.became_law, false) and new.effective_date is not null then
    if new.effective_date <= current_date
       and new.current_status_code in ('signed','became-law') then
      new.current_status_code := 'effective';
      new.current_status_label := 'Effective';
    elsif new.effective_date > current_date
       and new.current_status_code = 'effective' then
      select
        bool_or(action_text ~* '^Filed without (the Governor''s )?signature\s*$'),
        bool_or(action_text ~* '^Signed by the Governor')
      into v_filed_without_signature, v_signed_action
      from public.bill_actions
      where bill_id = new.id;

      if coalesce(v_filed_without_signature, false) then
        new.current_status_code := 'became-law';
        new.current_status_label := 'Became law';
      elsif coalesce(v_signed_action, false) then
        new.current_status_code := 'signed';
        new.current_status_label := 'Signed by governor';
      else
        new.current_status_code := 'became-law';
        new.current_status_label := 'Became law';
      end if;
    end if;
  end if;

  return new;
end;
$$;

revoke all on function public.preserve_temporal_bill_effective_status() from public, anon, authenticated;
grant execute on function public.preserve_temporal_bill_effective_status() to service_role, postgres;

drop trigger if exists bills_preserve_temporal_effective_status on public.bills;
create trigger bills_preserve_temporal_effective_status
before update on public.bills
for each row
execute function public.preserve_temporal_bill_effective_status();

create or replace function public.refresh_bill_effective_statuses()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_updated integer := 0;
  v_count integer := 0;
begin
  update public.bills
  set current_status_code = 'effective',
      current_status_label = 'Effective',
      updated_at = now()
  where became_law = true
    and effective_date is not null
    and effective_date <= current_date
    and current_status_code in ('signed','became-law');
  get diagnostics v_count = row_count;
  v_updated := v_updated + v_count;

  update public.bills b
  set current_status_code = case
        when exists (
          select 1 from public.bill_actions a
          where a.bill_id = b.id
            and a.action_text ~* '^Filed without (the Governor''s )?signature\s*$'
        ) then 'became-law'
        else 'signed'
      end,
      current_status_label = case
        when exists (
          select 1 from public.bill_actions a
          where a.bill_id = b.id
            and a.action_text ~* '^Filed without (the Governor''s )?signature\s*$'
        ) then 'Became law'
        else 'Signed by governor'
      end,
      updated_at = now()
  where b.became_law = true
    and b.effective_date is not null
    and b.effective_date > current_date
    and b.current_status_code = 'effective';
  get diagnostics v_count = row_count;
  v_updated := v_updated + v_count;

  return v_updated;
end;
$$;

revoke all on function public.refresh_bill_effective_statuses() from public, anon, authenticated;
grant execute on function public.refresh_bill_effective_statuses() to service_role, postgres;

select public.refresh_bill_effective_statuses();

select cron.unschedule(jobid)
from cron.job
where jobname = 'refresh-bill-effective-statuses';

select cron.schedule(
  'refresh-bill-effective-statuses',
  '15 6 * * *',
  $cron$select public.refresh_bill_effective_statuses();$cron$
);
