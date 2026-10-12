-- Explicit human approval gate. The source watcher never invokes this function.
-- Requires a signed-in Supabase Auth user whose UUID is explicitly registered as an editor.
create table if not exists public.ktr_evergreen_reviewers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  enabled boolean not null default true,
  added_at timestamptz not null default now()
);
alter table public.ktr_evergreen_reviewers enable row level security;
revoke all on public.ktr_evergreen_reviewers from public, anon, authenticated;
grant select, insert, update, delete on public.ktr_evergreen_reviewers to service_role;

create or replace function public.ktr_approve_evergreen_verification(p_entity_id text)
returns boolean language plpgsql security definer set search_path = '' as $$
declare v_user uuid; v_record public.ktr_evergreen_verifications%rowtype; v_now timestamptz := now();
begin
  v_user := auth.uid();
  if v_user is null or not exists(select 1 from public.ktr_evergreen_reviewers where user_id=v_user and enabled) then
    raise exception 'Authenticated authorized editor required';
  end if;
  select * into v_record from public.ktr_evergreen_verifications where entity_id=p_entity_id for update;
  if not found or v_record.status <> 'retrieved-not-verified' or v_record.next_check_at is null or v_record.next_check_at <= v_now
     or v_record.pending_changes <> '[]'::jsonb or jsonb_array_length(v_record.official_sources)=0
     or jsonb_array_length(v_record.evidence)=0 then raise exception 'Verification record is not eligible'; end if;
  -- Source-watch records are retrieval observations, not editorial fact verification.
  if p_entity_id like 'source:%' then raise exception 'Raw source observations cannot be fact-approved'; end if;
  if exists(select 1 from jsonb_array_elements(v_record.evidence) e where e->>'status' <> 'available'
       or nullif(e->>'checkedAt','') is null
       or (e->>'checkedAt')::timestamptz > v_now) then raise exception 'Invalid source evidence'; end if;
  if exists(select 1 from jsonb_array_elements_text(v_record.official_sources) s
       where not exists(select 1 from jsonb_array_elements(v_record.evidence) e
         where e->>'url'=s.value and e->>'status'='available')) then raise exception 'Missing official evidence'; end if;
  update public.ktr_evergreen_verifications
    set status='verified',last_verified_at=v_now,reviewer_approved_at=v_now,updated_at=v_now
    where entity_id=p_entity_id;
  insert into public.ktr_evergreen_verification_events(entity_id,event_type,evidence,changes)
    values(p_entity_id,'editor-approved',jsonb_build_object('reviewer_uid',v_user,'approved_at',v_now), '[]'::jsonb);
  return true;
end $$;
revoke all on function public.ktr_approve_evergreen_verification(text) from public, anon;
grant execute on function public.ktr_approve_evergreen_verification(text) to authenticated;
