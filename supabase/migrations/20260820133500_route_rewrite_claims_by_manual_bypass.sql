create or replace function public.claim_contextual_ai_rewrite_slot(
  p_content_fingerprint text,
  p_feed_item_id bigint,
  p_daily_limit integer default 25
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_manual boolean := false;
  v_result text;
begin
  if p_content_fingerprint is null or btrim(p_content_fingerprint) = '' then
    raise exception 'p_content_fingerprint must not be empty'
      using errcode = '22023';
  end if;
  if p_feed_item_id is null or p_feed_item_id < 1 then
    raise exception 'p_feed_item_id must be positive'
      using errcode = '22023';
  end if;

  perform pg_advisory_xact_lock(hashtext('ai_rewrite_context:' || p_feed_item_id::text));

  delete from public.ai_rewrite_manual_bypass
  where expires_at <= now();

  delete from public.ai_rewrite_manual_bypass
  where feed_item_id = p_feed_item_id
    and expires_at > now()
  returning true into v_manual;

  if coalesce(v_manual, false) then
    v_result := public.claim_ai_rewrite_slot(
      p_content_fingerprint,
      p_feed_item_id,
      p_daily_limit
    );
  else
    v_result := public.claim_automated_ai_rewrite_slot(
      p_content_fingerprint,
      p_feed_item_id,
      p_daily_limit
    );
  end if;

  return v_result;
end;
$$;

revoke all on function public.claim_contextual_ai_rewrite_slot(text, bigint, integer) from public;
grant execute on function public.claim_contextual_ai_rewrite_slot(text, bigint, integer) to service_role;

comment on function public.claim_contextual_ai_rewrite_slot(text, bigint, integer) is
  'Routes an AI rewrite reservation to the manual budget-exempt claim only when an unexpired one-time admin bypass marker exists for the feed item; all other callers use the automated rewrite budget.';
