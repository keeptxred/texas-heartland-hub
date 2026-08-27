-- Reconcile the final production contract for the TLO bill catalog, schedule
-- surfaces, sponsor identities, and private sync wrapper. This migration is
-- intentionally idempotent and does not replay exploratory intermediate work.

create schema if not exists private;

-- 89th Legislature called sessions.
insert into public.legislative_sessions (
  legislature_number, session_code, session_name, session_type,
  start_date, end_date, is_current, source_url
) values
  (89,'1','89th Texas Legislature First Called Session','called','2025-07-21','2025-08-15',false,
   'https://lrl.texas.gov/sessions/sessionSnapshot.cfm?legSession=89-1'),
  (89,'2','89th Texas Legislature Second Called Session','called','2025-08-15','2025-09-04',false,
   'https://lrl.texas.gov/sessions/sessionSnapshot.cfm?legSession=89-2')
on conflict (legislature_number,session_code) do update set
  session_name=excluded.session_name,
  session_type=excluded.session_type,
  start_date=excluded.start_date,
  end_date=excluded.end_date,
  source_url=excluded.source_url,
  updated_at=now();

-- Legislative join-path indexes used by bill/committee pages and refresh jobs.
create index if not exists bill_actions_committee_id_idx
  on public.bill_actions(committee_id) where committee_id is not null;
create index if not exists bill_committee_history_committee_id_idx
  on public.bill_committee_history(committee_id) where committee_id is not null;
create index if not exists bill_subject_relationships_subject_id_idx
  on public.bill_subject_relationships(subject_id);
create index if not exists bills_current_committee_id_idx
  on public.bills(current_committee_id) where current_committee_id is not null;
create index if not exists bills_legislative_session_id_idx
  on public.bills(legislative_session_id) where legislative_session_id is not null;
create index if not exists legislative_content_opportunities_action_id_idx
  on public.legislative_content_opportunities(action_id) where action_id is not null;

-- Schedule notices are separate from legal bill chronology.
create table if not exists public.bill_schedule_events (
  id uuid primary key default gen_random_uuid(),
  bill_id uuid not null references public.bills(id) on delete cascade,
  schedule_type text not null check (schedule_type in ('hearing','calendar')),
  event_date date not null,
  chamber text,
  committee_id uuid references public.legislative_committees(id) on delete set null,
  committee_name text,
  title text not null,
  source_url text not null,
  source_key text not null default 'tlo-rss-bill-sync',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  is_active boolean not null default true
);
create unique index if not exists bill_schedule_events_source_identity_uidx
  on public.bill_schedule_events(bill_id,schedule_type,source_url);
create index if not exists bill_schedule_events_bill_date_idx
  on public.bill_schedule_events(bill_id,event_date desc);
create index if not exists bill_schedule_events_committee_date_idx
  on public.bill_schedule_events(committee_id,event_date desc) where committee_id is not null;
create index if not exists bill_schedule_events_upcoming_idx
  on public.bill_schedule_events(event_date,schedule_type,chamber);

alter table public.bill_schedule_events enable row level security;
drop policy if exists "Public reads official bill schedule events" on public.bill_schedule_events;
create policy "Public reads official bill schedule events"
  on public.bill_schedule_events for select to anon,authenticated using (true);
revoke insert,update,delete,truncate on public.bill_schedule_events from anon,authenticated;
grant select on public.bill_schedule_events to anon,authenticated;
grant all on public.bill_schedule_events to service_role;

-- Correct an RSS action/event to the exact session encoded in its TLO URL when
-- duplicate bill numbers exist across regular/called sessions.
create or replace function private.correct_tlo_bill_id_from_source()
returns trigger
language plpgsql
security definer
set search_path=public,private,pg_temp
as $$
declare
  v_match text[];
  v_bill_type text;
  v_bill_number integer;
  v_legislature integer;
  v_session text;
  v_exact_id uuid;
begin
  if new.bill_id is null or nullif(new.source_url,'') is null then return new; end if;
  v_match:=regexp_match(new.source_url,'(?:/tlodocs/|[?&]LegSess=)([0-9]{2})(R|[0-9]+)(?:/|&|$)','i');
  if v_match is null then return new; end if;
  select bill_type,bill_number,legislature_number,session_code
    into v_bill_type,v_bill_number,v_legislature,v_session
  from public.bills where id=new.bill_id;
  if not found then return new; end if;
  if v_legislature=v_match[1]::integer and upper(v_session)=upper(v_match[2]) then return new; end if;
  select id into v_exact_id from public.bills
  where bill_type=v_bill_type and bill_number=v_bill_number
    and legislature_number=v_match[1]::integer
    and upper(session_code)=upper(v_match[2]) and is_active=true
  order by updated_at desc limit 1;
  if v_exact_id is not null then new.bill_id:=v_exact_id; end if;
  return new;
end;
$$;
revoke all on function private.correct_tlo_bill_id_from_source() from public,anon,authenticated;
grant execute on function private.correct_tlo_bill_id_from_source() to service_role;

drop trigger if exists correct_tlo_action_bill_session on public.bill_actions;
create trigger correct_tlo_action_bill_session
before insert or update of bill_id,source_url on public.bill_actions
for each row when (new.action_code like 'tlo-rss-%')
execute function private.correct_tlo_bill_id_from_source();

drop trigger if exists correct_tlo_schedule_bill_session on public.bill_schedule_events;
create trigger correct_tlo_schedule_bill_session
before insert or update of bill_id,source_url on public.bill_schedule_events
for each row when (new.source_url is not null)
execute function private.correct_tlo_bill_id_from_source();

create or replace function private.capture_bill_schedule_event_from_action()
returns trigger
language plpgsql
security definer
set search_path=public,private,pg_temp
as $$
declare
  v_schedule_type text;
  v_committee_name text;
begin
  if new.action_code not in ('tlo-rss-meeting','tlo-rss-calendar') or new.action_date is null then return new; end if;
  v_schedule_type:=case new.action_code when 'tlo-rss-meeting' then 'hearing' else 'calendar' end;
  if new.committee_id is not null then
    select committee_name into v_committee_name from public.legislative_committees where id=new.committee_id;
  end if;
  insert into public.bill_schedule_events(
    bill_id,schedule_type,event_date,chamber,committee_id,committee_name,title,
    source_url,source_key,metadata,first_seen_at,last_seen_at,is_active,updated_at
  ) values (
    new.bill_id,v_schedule_type,new.action_date,new.chamber,new.committee_id,v_committee_name,new.action_text,
    coalesce(new.source_url,'https://capitol.texas.gov/'),'tlo-rss-bill-sync',
    jsonb_build_object('action_code',new.action_code,'normalized_status',new.normalized_status,'bill_action_id',new.id),
    now(),now(),true,now()
  )
  on conflict (bill_id,schedule_type,source_url) do update set
    event_date=excluded.event_date,chamber=excluded.chamber,committee_id=excluded.committee_id,
    committee_name=excluded.committee_name,title=excluded.title,metadata=excluded.metadata,
    last_seen_at=now(),is_active=true,updated_at=now();
  return new;
end;
$$;
revoke all on function private.capture_bill_schedule_event_from_action() from public,anon,authenticated;
grant execute on function private.capture_bill_schedule_event_from_action() to service_role;

drop trigger if exists capture_bill_schedule_event_from_action on public.bill_actions;
create trigger capture_bill_schedule_event_from_action
after insert or update of action_code,action_date,action_text,source_url,committee_id,chamber,normalized_status
on public.bill_actions for each row execute function private.capture_bill_schedule_event_from_action();

create or replace view public.upcoming_legislative_schedule
with (security_invoker=true) as
select
  e.id,e.schedule_type,e.event_date,e.chamber,e.title,e.source_url,e.first_seen_at,e.last_seen_at,
  b.id as bill_id,b.legislature_number,b.session_code,b.bill_type,b.bill_number,b.bill_identifier,
  b.caption as bill_caption,b.current_status_label,
  c.id as committee_id,coalesce(e.committee_name,c.committee_name) as committee_name,c.committee_slug
from public.bill_schedule_events e
join public.bills b on b.id=e.bill_id
left join public.legislative_committees c on c.id=e.committee_id
where e.is_active=true and e.event_date>=current_date and b.is_active=true;
grant select on public.upcoming_legislative_schedule to anon,authenticated,service_role;

-- Defense in depth: future meeting/calendar notices may never advance the bill's
-- legal last_action_date unless a non-schedule action exists on the same date.
create or replace function private.preserve_bill_legal_last_action_date()
returns trigger
language plpgsql
set search_path=public,private,pg_temp
as $$
begin
  if new.last_action_date is distinct from old.last_action_date
     and new.last_action_date is not null
     and (old.last_action_date is null or new.last_action_date>old.last_action_date)
     and exists(select 1 from public.bill_actions a where a.bill_id=new.id and a.action_date=new.last_action_date and a.action_code in ('tlo-rss-meeting','tlo-rss-calendar'))
     and not exists(select 1 from public.bill_actions a where a.bill_id=new.id and a.action_date=new.last_action_date and coalesce(a.action_code,'') not in ('tlo-rss-meeting','tlo-rss-calendar'))
  then new.last_action_date:=old.last_action_date;
  end if;
  return new;
end;
$$;
drop trigger if exists preserve_bill_legal_last_action_date on public.bills;
create trigger preserve_bill_legal_last_action_date
before update of last_action_date on public.bills
for each row execute function private.preserve_bill_legal_last_action_date();

-- Sponsor chamber derives from bill origin + role.
create or replace function private.set_bill_sponsor_chamber_from_role()
returns trigger
language plpgsql
set search_path=public,private,pg_temp
as $$
declare v_bill_type text; v_origin text;
begin
  select lower(bill_type) into v_bill_type from public.bills where id=new.bill_id;
  if v_bill_type is null then return new; end if;
  if left(v_bill_type,1)='h' then v_origin:='house';
  elsif left(v_bill_type,1)='s' then v_origin:='senate';
  else return new; end if;
  if lower(new.sponsor_role) in ('author','coauthor') then new.chamber:=v_origin;
  elsif lower(new.sponsor_role) in ('sponsor','cosponsor') then new.chamber:=case when v_origin='house' then 'senate' else 'house' end;
  end if;
  return new;
end;
$$;
drop trigger if exists bill_sponsors_set_chamber_from_role on public.bill_sponsors;
create trigger bill_sponsors_set_chamber_from_role
before insert or update of bill_id,sponsor_role,chamber on public.bill_sponsors
for each row execute function private.set_bill_sponsor_chamber_from_role();

-- Immediate aliases cover malformed accented labels emitted by TLO static reports.
create table if not exists private.bill_sponsor_identity_aliases(
  alias_name text not null,
  chamber text not null,
  canonical_name text not null,
  canonical_slug text not null,
  district text,
  external_legislator_id text,
  source_url text,
  updated_at timestamptz not null default now(),
  primary key(alias_name,chamber)
);
revoke all on private.bill_sponsor_identity_aliases from public,anon,authenticated;
grant all on private.bill_sponsor_identity_aliases to service_role;
insert into private.bill_sponsor_identity_aliases(alias_name,chamber,canonical_name,canonical_slug,district,external_legislator_id,source_url) values
 ('Anch?a','house','Rafael Anchía','rafael-anchia','103','tlo:house:103','https://capitol.texas.gov/Members/MemberInfo.aspx?Leg=89&Chamber=H'),
 ('G?mez','house','Erin Gámez','erin-gamez','38','tlo:house:38','https://capitol.texas.gov/Members/MemberInfo.aspx?Leg=89&Chamber=H'),
 ('Gonz?lez, Jessica','house','Jessica González','jessica-gonzalez','104','tlo:house:104','https://capitol.texas.gov/Members/MemberInfo.aspx?Leg=89&Chamber=H'),
 ('Gonz?lez, Mary','house','Mary González','mary-gonzalez','75','tlo:house:75','https://capitol.texas.gov/Members/MemberInfo.aspx?Leg=89&Chamber=H'),
 ('Mu?oz','house','Sergio Muñoz','sergio-munoz','36','tlo:house:36','https://capitol.texas.gov/Members/MemberInfo.aspx?Leg=89&Chamber=H'),
 ('Rodr?guez Ramos','house','Ana-Maria Rodriguez Ramos','ana-maria-rodriguez-ramos','102','tlo:house:102','https://capitol.texas.gov/Members/MemberInfo.aspx?Leg=89&Chamber=H'),
 ('Men?ndez','senate','José Menéndez','jose-menendez','26','tlo:senate:26','https://capitol.texas.gov/Members/MemberInfo.aspx?Leg=89&Chamber=S')
on conflict(alias_name,chamber) do update set
 canonical_name=excluded.canonical_name,canonical_slug=excluded.canonical_slug,district=excluded.district,
 external_legislator_id=excluded.external_legislator_id,source_url=excluded.source_url,updated_at=now();

create or replace function private.normalize_bill_sponsor_identity_alias()
returns trigger
language plpgsql
security definer
set search_path=public,private,pg_temp
as $$
declare a private.bill_sponsor_identity_aliases%rowtype;
begin
  select * into a from private.bill_sponsor_identity_aliases
  where lower(trim(alias_name))=lower(trim(coalesce(new.sponsor_name,'')))
    and chamber=lower(coalesce(new.chamber,'')) limit 1;
  if found then
    new.sponsor_name:=a.canonical_name;
    new.sponsor_slug:=a.canonical_slug;
    new.district:=coalesce(a.district,new.district);
    new.external_legislator_id:=coalesce(a.external_legislator_id,new.external_legislator_id);
  end if;
  return new;
end;
$$;
revoke all on function private.normalize_bill_sponsor_identity_alias() from public,anon,authenticated;
grant execute on function private.normalize_bill_sponsor_identity_alias() to service_role;
drop trigger if exists zz_bill_sponsors_normalize_identity_alias on public.bill_sponsors;
create trigger zz_bill_sponsors_normalize_identity_alias
before insert or update of sponsor_name,chamber,bill_id,sponsor_role on public.bill_sponsors
for each row execute function private.normalize_bill_sponsor_identity_alias();

create or replace function private.refresh_sponsor_authority_edges_for_bills(p_bill_ids uuid[])
returns void
language plpgsql
security definer
set search_path=public,private,pg_temp
as $$
declare r record;
begin
  if coalesce(array_length(p_bill_ids,1),0)=0 then return; end if;
  for r in select b.id::text bill_key,bs.sponsor_slug target_key,bs.sponsor_role
    from public.bills b join public.bill_sponsors bs on bs.bill_id=b.id
    where b.id=any(p_bill_ids) and bs.sponsor_slug is not null
  loop
    perform public.upsert_bidirectional_authority_relationship('bill',r.bill_key,'representative',r.target_key,r.sponsor_role,
      case when lower(r.sponsor_role) in ('author','primary author','sponsor','primary sponsor') then 40 else 32 end,
      jsonb_build_object('source','official-sponsor-record'));
  end loop;
  for r in select distinct b.id::text bill_key,bs.sponsor_slug representative_key,
      case when lower(coalesce(bs.chamber,b.chamber))='house' then 'texas-house-district-'||regexp_replace(bs.district,'\D','','g')
           when lower(coalesce(bs.chamber,b.chamber))='senate' then 'texas-senate-district-'||regexp_replace(bs.district,'\D','','g') end district_key
    from public.bills b join public.bill_sponsors bs on bs.bill_id=b.id
    where b.id=any(p_bill_ids) and bs.district is not null and regexp_replace(bs.district,'\D','','g')<>''
  loop
    if r.district_key is not null then
      perform public.upsert_bidirectional_authority_relationship('bill',r.bill_key,'district',r.district_key,'sponsor-district',28,jsonb_build_object('source','official-sponsor-record'));
      if r.representative_key is not null then
        perform public.upsert_bidirectional_authority_relationship('representative',r.representative_key,'district',r.district_key,'represents-district',40,jsonb_build_object('source','official-sponsor-record'));
      end if;
    end if;
  end loop;
end;
$$;
revoke all on function private.refresh_sponsor_authority_edges_for_bills(uuid[]) from public,anon,authenticated;
grant execute on function private.refresh_sponsor_authority_edges_for_bills(uuid[]) to service_role;

-- Bounded, restart-safe normalizer for all 89th-Legislature sessions.
create or replace function public.normalize_89th_bill_sponsors_batch(p_aliases jsonb,p_limit integer default 250)
returns jsonb
language plpgsql
security definer
set search_path=public,private,pg_temp
as $$
declare v_deleted integer:=0; v_updated integer:=0; v_touched integer:=0;
begin
  if coalesce(jsonb_typeof(p_aliases),'')<>'array' then raise exception 'p_aliases must be a JSON array'; end if;
  p_limit:=greatest(1,least(coalesce(p_limit,250),500));
  create temporary table _sponsor_aliases(old_name text not null,chamber text not null,full_name text not null,canonical_slug text not null,district text,external_legislator_id text not null,primary key(old_name,chamber)) on commit drop;
  insert into _sponsor_aliases
  select trim(x.old_name),lower(trim(x.chamber)),trim(x.full_name),trim(x.canonical_slug),nullif(trim(x.district),''),trim(x.external_legislator_id)
  from jsonb_to_recordset(p_aliases) as x(old_name text,chamber text,full_name text,canonical_slug text,district text,external_legislator_id text)
  where nullif(trim(x.old_name),'') is not null and lower(trim(x.chamber)) in ('house','senate')
    and nullif(trim(x.full_name),'') is not null and nullif(trim(x.canonical_slug),'') is not null and nullif(trim(x.external_legislator_id),'') is not null
  on conflict(old_name,chamber) do update set full_name=excluded.full_name,canonical_slug=excluded.canonical_slug,district=excluded.district,external_legislator_id=excluded.external_legislator_id;
  create temporary table _candidate_bills on commit drop as
  select distinct bs.bill_id
  from public.bill_sponsors bs join public.bills b on b.id=bs.bill_id
  join _sponsor_aliases a on lower(trim(bs.sponsor_name))=lower(trim(a.old_name)) and lower(coalesce(bs.chamber,b.chamber,''))=a.chamber
  where b.legislature_number=89 and (bs.sponsor_name is distinct from a.full_name or bs.sponsor_slug is distinct from a.canonical_slug or bs.chamber is distinct from a.chamber or bs.district is distinct from a.district or bs.external_legislator_id is distinct from a.external_legislator_id)
  order by bs.bill_id limit p_limit;
  select count(*) into v_touched from _candidate_bills;
  if v_touched=0 then return jsonb_build_object('updated',0,'deduplicated',0,'touched_bills',0,'aliases',(select count(*) from _sponsor_aliases)); end if;
  create temporary table _candidate_sponsors on commit drop as
  select bs.id,bs.bill_id,bs.representative_id,bs.sponsor_role,a.full_name,a.canonical_slug,a.chamber,a.district,a.external_legislator_id
  from public.bill_sponsors bs join _candidate_bills cb on cb.bill_id=bs.bill_id join public.bills b on b.id=bs.bill_id
  join _sponsor_aliases a on lower(trim(bs.sponsor_name))=lower(trim(a.old_name)) and lower(coalesce(bs.chamber,b.chamber,''))=a.chamber
  where bs.sponsor_name is distinct from a.full_name or bs.sponsor_slug is distinct from a.canonical_slug or bs.chamber is distinct from a.chamber or bs.district is distinct from a.district or bs.external_legislator_id is distinct from a.external_legislator_id;
  delete from public.bill_sponsors bs using _candidate_sponsors c
  where bs.id=c.id and exists(select 1 from public.bill_sponsors x where x.id<>bs.id and x.bill_id=bs.bill_id and x.representative_id is not distinct from bs.representative_id and x.external_legislator_id is not distinct from c.external_legislator_id and x.sponsor_name=c.full_name and x.sponsor_role=bs.sponsor_role);
  get diagnostics v_deleted=row_count;
  update public.bill_sponsors bs set sponsor_name=c.full_name,sponsor_slug=c.canonical_slug,chamber=c.chamber,district=c.district,external_legislator_id=c.external_legislator_id from _candidate_sponsors c where bs.id=c.id;
  get diagnostics v_updated=row_count;
  delete from public.authority_relationships ar where ar.is_manual=false and ar.relationship_type in ('author','coauthor','sponsor','cosponsor','primary author','primary sponsor','sponsor-district') and ((ar.source_type='bill' and ar.source_key in(select bill_id::text from _candidate_bills)) or (ar.target_type='bill' and ar.target_key in(select bill_id::text from _candidate_bills)));
  perform private.refresh_sponsor_authority_edges_for_bills(array(select bill_id from _candidate_bills));
  return jsonb_build_object('updated',v_updated,'deduplicated',v_deleted,'touched_bills',v_touched,'aliases',(select count(*) from _sponsor_aliases));
end;
$$;
revoke all on function public.normalize_89th_bill_sponsors_batch(jsonb,integer) from public,anon,authenticated;
grant execute on function public.normalize_89th_bill_sponsors_batch(jsonb,integer) to service_role;

-- Private token bridge. Never hardcode the token into source control.
create table if not exists private.tlo_sync_config(
  singleton boolean primary key default true,
  token text not null default encode(gen_random_bytes(32),'hex'),
  updated_at timestamptz not null default now(),
  check (singleton=true)
);
revoke all on private.tlo_sync_config from public,anon,authenticated;
grant all on private.tlo_sync_config to service_role;
insert into private.tlo_sync_config(singleton) values(true) on conflict(singleton) do nothing;

create or replace function public.verify_tlo_sync_token(p_token text)
returns boolean
language sql
stable
security definer
set search_path=public,private,pg_temp
as $$
  select exists(select 1 from private.tlo_sync_config where singleton=true and token=p_token);
$$;
revoke all on function public.verify_tlo_sync_token(text) from public,anon,authenticated;
grant execute on function public.verify_tlo_sync_token(text) to service_role;

create or replace function private.trigger_tlo_bill_sync(p_action text)
returns bigint
language plpgsql
security definer
set search_path=private,public,net,pg_temp
as $$
declare v_token text; v_request_id bigint;
begin
  if p_action not in ('backfill','normalize','sync','catalog') then raise exception 'unsupported action'; end if;
  select token into v_token from private.tlo_sync_config where singleton=true;
  if v_token is null then raise exception 'TLO sync token missing'; end if;
  select net.http_post(
    url:='https://ftkznprjljkhymknvhye.supabase.co/functions/v1/tlo-bill-sync-trigger',
    headers:=jsonb_build_object('Content-Type','application/json','x-ktr-tlo-sync',v_token),
    body:=jsonb_build_object('action',p_action),
    timeout_milliseconds:=120000
  ) into v_request_id;
  return v_request_id;
end;
$$;
revoke all on function private.trigger_tlo_bill_sync(text) from public,anon,authenticated;
grant execute on function private.trigger_tlo_bill_sync(text) to service_role;

-- Remove obsolete automated sponsor edges left by malformed pre-normalization keys.
delete from public.authority_relationships ar
where ar.is_manual=false and coalesce(ar.evidence->>'source','')='official-sponsor-record'
  and ar.relationship_type in ('author','coauthor','sponsor','cosponsor','primary author','primary sponsor')
  and (
    (ar.source_type='bill' and ar.target_type='representative'
      and exists(select 1 from public.bills b where b.id::text=ar.source_key and b.legislature_number=89)
      and not exists(select 1 from public.bill_sponsors bs where bs.bill_id::text=ar.source_key and bs.sponsor_slug=ar.target_key and lower(bs.sponsor_role)=lower(ar.relationship_type)))
    or
    (ar.source_type='representative' and ar.target_type='bill'
      and exists(select 1 from public.bills b where b.id::text=ar.target_key and b.legislature_number=89)
      and not exists(select 1 from public.bill_sponsors bs where bs.bill_id::text=ar.target_key and bs.sponsor_slug=ar.source_key and lower(bs.sponsor_role)=lower(ar.relationship_type)))
  );
