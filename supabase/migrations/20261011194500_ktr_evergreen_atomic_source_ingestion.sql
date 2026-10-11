-- Atomic, service-role-only ingestion of source monitoring batches.
create or replace function public.ktr_ingest_evergreen_source_batch(p_results jsonb)
returns integer language plpgsql security invoker set search_path = public, pg_temp as $$
declare item jsonb; source_id text; source_url text; check_time timestamptz; result_status text; mapped_status text; n integer := 0;
begin
 if auth.role() is distinct from 'service_role' then raise exception 'Service role required'; end if;
 if jsonb_typeof(p_results) <> 'array' or jsonb_array_length(p_results) not between 1 and 25 then raise exception 'Expected 1-25 source results'; end if;
 if (select count(distinct e->>'id') from jsonb_array_elements(p_results) e) <> jsonb_array_length(p_results) then raise exception 'Duplicate source IDs'; end if;
 for item in select value from jsonb_array_elements(p_results) loop
  source_id := item->>'id'; source_url := item->>'url'; result_status := item->>'status';
  if source_id is null or source_id !~ '^[a-z0-9-]{1,80}$' then raise exception 'Invalid source ID'; end if;
  if source_url is null or source_url !~ '^https://([a-zA-Z0-9-]+\.)+[a-zA-Z0-9-]*gov(/|:443/|\?|#|$)' then raise exception 'Invalid government URL'; end if;
  if result_status not in ('retrieved-not-verified','unavailable','manual-review') or result_status is null then raise exception 'Invalid status'; end if;
  begin check_time := (item->>'checkedAt')::timestamptz; exception when others then raise exception 'Invalid checkedAt'; end;
  if check_time is null then raise exception 'Missing checkedAt'; end if;
 end loop;
 for item in select value from jsonb_array_elements(p_results) loop
  source_id := item->>'id'; source_url := item->>'url'; result_status := item->>'status'; check_time := (item->>'checkedAt')::timestamptz;
  mapped_status := case result_status when 'retrieved-not-verified' then 'retrieved-not-verified' when 'unavailable' then 'source-unavailable' else 'needs-review' end;
  insert into public.ktr_evergreen_verifications(entity_id,route,cadence,status,official_sources,evidence,last_checked_at,next_check_at,updated_at,reviewer_approved_at)
  values('source:'||source_id,'/internal/evergreen/sources/'||source_id,'weekly',mapped_status,jsonb_build_array(source_url),jsonb_build_array(item),check_time,check_time + interval '7 days',now(),null)
  on conflict(entity_id) do update set status=excluded.status,official_sources=excluded.official_sources,evidence=excluded.evidence,last_checked_at=excluded.last_checked_at,next_check_at=excluded.next_check_at,updated_at=now(),reviewer_approved_at=null;
  insert into public.ktr_evergreen_verification_events(entity_id,event_type,evidence,changes) values('source:'||source_id,'source-check',jsonb_build_array(item),'[]'::jsonb);
  n:=n+1;
 end loop;
 return n;
end $$;
revoke all on function public.ktr_ingest_evergreen_source_batch(jsonb) from public, anon, authenticated;
grant execute on function public.ktr_ingest_evergreen_source_batch(jsonb) to service_role;
