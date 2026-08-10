-- Create a deduplicated editorial opportunity whenever a meaningful action is inserted.
create or replace function public.queue_legislative_action_opportunity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_bill public.bills%rowtype;
  v_event text;
  v_priority integer;
  v_headline text;
begin
  select * into v_bill from public.bills where id = new.bill_id;
  if not found then return new; end if;

  v_event := case
    when lower(new.action_text) ~ 'veto' then 'vetoed'
    when lower(new.action_text) ~ 'signed by the governor|governor signed' then 'signed'
    when lower(new.action_text) ~ 'became law|filed without signature|effective' then 'became-law'
    when lower(new.action_text) ~ 'sent to the governor|presented to governor' then 'sent-to-governor'
    when lower(new.action_text) ~ 'passed senate' then 'passed-senate'
    when lower(new.action_text) ~ 'passed house' then 'passed-house'
    when lower(new.action_text) ~ 'record vote|vote recorded|yeas|nays|adopted' then 'vote'
    when lower(new.action_text) ~ 'public hearing|scheduled for hearing|hearing set' then 'committee-hearing'
    when lower(new.action_text) ~ 'referred to|committee referral' then 'committee-referral'
    when lower(new.action_text) ~ 'filed|introduced|received by the secretary' then 'filed'
    else null
  end;
  if v_event is null then return new; end if;

  v_priority := case v_event
    when 'vetoed' then 100 when 'signed' then 98 when 'became-law' then 96
    when 'sent-to-governor' then 92 when 'passed-senate' then 88 when 'passed-house' then 88
    when 'vote' then 78 when 'committee-hearing' then 72 when 'committee-referral' then 62
    else 45 end;

  v_headline := case v_event
    when 'vetoed' then v_bill.bill_identifier || ' vetoed'
    when 'signed' then v_bill.bill_identifier || ' signed by governor'
    when 'became-law' then v_bill.bill_identifier || ' becomes Texas law'
    when 'sent-to-governor' then v_bill.bill_identifier || ' sent to governor'
    when 'passed-senate' then v_bill.bill_identifier || ' passes Texas Senate'
    when 'passed-house' then v_bill.bill_identifier || ' passes Texas House'
    when 'vote' then v_bill.bill_identifier || ' receives recorded vote'
    when 'committee-hearing' then v_bill.bill_identifier || ' committee hearing scheduled'
    when 'committee-referral' then v_bill.bill_identifier || ' referred to committee'
    else v_bill.bill_identifier || ' filed'
  end;

  insert into public.legislative_content_opportunities
    (bill_id, action_id, event_type, event_date, headline, summary, priority, source_url, dedupe_key, metadata)
  values (
    new.bill_id, new.id, v_event, new.action_date, v_headline,
    new.action_text || case when v_bill.caption is not null then ' — ' || v_bill.caption else '' end,
    v_priority, coalesce(new.source_url, v_bill.source_url),
    new.bill_id::text || ':' || v_event || ':' || new.id::text,
    jsonb_build_object('bill_identifier', v_bill.bill_identifier, 'caption', v_bill.caption, 'action_text', new.action_text)
  )
  on conflict (dedupe_key) do nothing;

  return new;
end;
$$;

drop trigger if exists queue_legislative_action_opportunity on public.bill_actions;
create trigger queue_legislative_action_opportunity
after insert on public.bill_actions
for each row execute function public.queue_legislative_action_opportunity();