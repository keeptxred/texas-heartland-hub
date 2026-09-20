create or replace function public.claim_automated_ai_rewrite_slot(
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
  v_completed_today integer;
  v_recent_failures integer := 0;
  v_limit integer;
begin
  if p_content_fingerprint is null or btrim(p_content_fingerprint) = '' then
    raise exception 'p_content_fingerprint must not be empty'
      using errcode = '22023';
  end if;

  v_limit := least(100, greatest(1, coalesce(p_daily_limit, 25)));

  perform pg_advisory_xact_lock(hashtext('ai_rewrite_automated_daily_budget'));
  if p_feed_item_id is not null then
    perform pg_advisory_xact_lock(hashtext('ai_rewrite_feed:' || p_feed_item_id::text));
  end if;

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
    select count(*) into v_recent_failures
    from public.ai_rewrite_failures f
    join public.ai_rewrite_cache c
      on c.content_fingerprint = f.content_fingerprint
     and c.feed_item_id = f.feed_item_id
    where f.feed_item_id = p_feed_item_id
      and f.failed_at >= now() - interval '24 hours'
      and c.budget_exempt = false;

    if v_recent_failures >= 2 then
      return 'cooldown';
    end if;
  end if;

  select count(*) into v_completed_today
  from public.ai_rewrite_cache
  where status = 'completed'
    and result_json is not null
    and budget_exempt = false
    and completed_at >= date_trunc('day', now())
    and completed_at < date_trunc('day', now()) + interval '1 day';

  if v_completed_today >= v_limit then
    return 'budget_exhausted';
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
    false
  )
  on conflict (content_fingerprint) do update set
    feed_item_id = excluded.feed_item_id,
    status = 'pending',
    result_json = null,
    failure_reason = null,
    claimed_at = now(),
    completed_at = null,
    updated_at = now(),
    budget_exempt = false;

  return 'claimed';
end;
$function$;
