-- Separate manual admin rewrites from the automated daily AI budget.
--
-- Current application behavior calls claim_ai_rewrite_slot() only from the
-- explicit Admin "Publish to Keep Texas Red" action. That path is now marked
-- budget-exempt. Automated jobs must use claim_automated_ai_rewrite_slot(),
-- which allows 25 SUCCESSFUL rewrites per UTC day.
--
-- Failed and pending rewrites do not consume the automated allowance because
-- the automated gate counts only completed, non-exempt cache rows.

ALTER TABLE public.ai_rewrite_cache
  ADD COLUMN IF NOT EXISTS budget_exempt boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS ai_rewrite_cache_completed_budget_idx
  ON public.ai_rewrite_cache (completed_at DESC)
  WHERE status = 'completed' AND budget_exempt = false;

-- Existing three-argument RPC is the manual admin reservation path.
-- Preserve its signature so deployed application code does not break.
CREATE OR REPLACE FUNCTION public.claim_ai_rewrite_slot(
  p_content_fingerprint text,
  p_feed_item_id bigint,
  p_daily_limit integer DEFAULT 25
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_existing public.ai_rewrite_cache%ROWTYPE;
BEGIN
  IF p_content_fingerprint IS NULL OR btrim(p_content_fingerprint) = '' THEN
    RAISE EXCEPTION 'p_content_fingerprint must not be empty'
      USING ERRCODE = '22023';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtext('ai_rewrite_cache:' || p_content_fingerprint));

  SELECT * INTO v_existing
  FROM public.ai_rewrite_cache
  WHERE content_fingerprint = p_content_fingerprint
  FOR UPDATE;

  IF FOUND
     AND v_existing.status = 'completed'
     AND v_existing.result_json IS NOT NULL THEN
    RETURN 'cached';
  END IF;

  IF FOUND
     AND v_existing.status = 'pending'
     AND v_existing.updated_at > now() - interval '15 minutes' THEN
    RETURN 'in_progress';
  END IF;

  INSERT INTO public.ai_rewrite_cache (
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
  VALUES (
    p_content_fingerprint,
    p_feed_item_id,
    'pending',
    NULL,
    NULL,
    now(),
    NULL,
    now(),
    true
  )
  ON CONFLICT (content_fingerprint) DO UPDATE SET
    feed_item_id = EXCLUDED.feed_item_id,
    status = 'pending',
    result_json = NULL,
    failure_reason = NULL,
    claimed_at = now(),
    completed_at = NULL,
    updated_at = now(),
    budget_exempt = true;

  RETURN 'claimed';
END;
$$;

REVOKE ALL ON FUNCTION public.claim_ai_rewrite_slot(text, bigint, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_ai_rewrite_slot(text, bigint, integer) TO service_role;

COMMENT ON FUNCTION public.claim_ai_rewrite_slot(text, bigint, integer) IS
  'Reserves an AI rewrite for an explicit manual admin publish. Manual rewrites are exempt from the automated daily budget.';

-- Automated jobs must use this RPC. Only successful completed rewrites count
-- toward the 25-per-UTC-day allowance. Claims that later fail remain status
-- failed and therefore never reduce the available successful-rewrite budget.
CREATE OR REPLACE FUNCTION public.claim_automated_ai_rewrite_slot(
  p_content_fingerprint text,
  p_feed_item_id bigint,
  p_daily_limit integer DEFAULT 25
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_existing public.ai_rewrite_cache%ROWTYPE;
  v_completed_today integer;
  v_limit integer;
BEGIN
  IF p_content_fingerprint IS NULL OR btrim(p_content_fingerprint) = '' THEN
    RAISE EXCEPTION 'p_content_fingerprint must not be empty'
      USING ERRCODE = '22023';
  END IF;

  v_limit := LEAST(100, GREATEST(1, COALESCE(p_daily_limit, 25)));

  PERFORM pg_advisory_xact_lock(hashtext('ai_rewrite_automated_daily_budget'));

  SELECT * INTO v_existing
  FROM public.ai_rewrite_cache
  WHERE content_fingerprint = p_content_fingerprint
  FOR UPDATE;

  IF FOUND
     AND v_existing.status = 'completed'
     AND v_existing.result_json IS NOT NULL THEN
    RETURN 'cached';
  END IF;

  IF FOUND
     AND v_existing.status = 'pending'
     AND v_existing.updated_at > now() - interval '15 minutes' THEN
    RETURN 'in_progress';
  END IF;

  SELECT count(*) INTO v_completed_today
  FROM public.ai_rewrite_cache
  WHERE status = 'completed'
    AND result_json IS NOT NULL
    AND budget_exempt = false
    AND completed_at >= date_trunc('day', now())
    AND completed_at < date_trunc('day', now()) + interval '1 day';

  IF v_completed_today >= v_limit THEN
    RETURN 'budget_exhausted';
  END IF;

  INSERT INTO public.ai_rewrite_cache (
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
  VALUES (
    p_content_fingerprint,
    p_feed_item_id,
    'pending',
    NULL,
    NULL,
    now(),
    NULL,
    now(),
    false
  )
  ON CONFLICT (content_fingerprint) DO UPDATE SET
    feed_item_id = EXCLUDED.feed_item_id,
    status = 'pending',
    result_json = NULL,
    failure_reason = NULL,
    claimed_at = now(),
    completed_at = NULL,
    updated_at = now(),
    budget_exempt = false;

  RETURN 'claimed';
END;
$$;

REVOKE ALL ON FUNCTION public.claim_automated_ai_rewrite_slot(text, bigint, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_automated_ai_rewrite_slot(text, bigint, integer) TO service_role;

COMMENT ON FUNCTION public.claim_automated_ai_rewrite_slot(text, bigint, integer) IS
  'Reserves an automated rewrite. Enforces a default limit of 25 successful non-exempt rewrites per UTC day; failed and pending attempts do not count.';
