create or replace function public.claim_ai_rewrite_slot(
  p_content_fingerprint text,
  p_feed_item_id bigint,
  p_daily_limit integer default 25
)
returns text
language plpgsql
security definer
set search_path = public
as $function$
declare
  v_existing public.ai_rewrite_cache%rowtype;
begin
  if p_content_fingerprint is null or btrim(p_content_fingerprint) = '' then
    raise exception 'p_content_fingerprint must not be empty'
      using errcode = '22023';
  end if;

  if p_feed_item_id is not null then
    perform pg_advisory_xact_lock(hashtext('ai_rewrite_feed:' || p_feed_item_id::text));
  end if;
  perform pg_advisory_xact_lock(hashtext('ai_rewrite_cache:' || p_content_fingerprint));

  select * into v_existing
  from public.ai_rewrite_cache
  where content_fingerprint = p_content_fingerprint
  for update;

  if found
     and v_existing.status = 'completed'
     and v_existing.result_json is not null then
    return 'cached';
  end if;

  if found
     and v_existing.status = 'pending'
     and v_existing.updated_at > now() - interval '15 minutes' then
    return 'in_progress';
  end if;

  if p_feed_item_id is not null then
    delete from public.ai_rewrite_cache
    where feed_item_id = p_feed_item_id
      and content_fingerprint <> p_content_fingerprint
      and status = 'pending'
      and result_json is null
      and budget_exempt is true;
  end if;

  insert into public.ai_rewrite_cache (
    content_fingerprint,
    feed_item_id,
    status,
    result_json,
    failure_reason,
    claimed_at,
    completed_at,
    updated_at,
    budget_exempt
  )
  values (
    p_content_fingerprint,
    p_feed_item_id,
    'pending',
    null,
    null,
    now(),
    null,
    now(),
    true
  )
  on conflict (content_fingerprint) do update set
    feed_item_id = excluded.feed_item_id,
    status = 'pending',
    result_json = null,
    failure_reason = null,
    claimed_at = now(),
    completed_at = null,
    updated_at = now(),
    budget_exempt = true;

  return 'claimed';
end;
$function$;

delete from public.ai_rewrite_cache
where status = 'pending'
  and result_json is null
  and budget_exempt is true
  and updated_at <= now() - interval '15 minutes';
