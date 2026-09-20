-- Low-credit newsroom Phase 7: hard sitewide AI generation budget guardrails.
-- Reservations are atomic so concurrent workers cannot overspend the daily cap.

ALTER TABLE public.ai_generation_budget
  ADD COLUMN IF NOT EXISTS briefing_reserved integer NOT NULL DEFAULT 0 CHECK (briefing_reserved >= 0);

ALTER TABLE public.ai_generation_budget
  DROP CONSTRAINT IF EXISTS ai_generation_budget_briefing_capacity;
ALTER TABLE public.ai_generation_budget
  ADD CONSTRAINT ai_generation_budget_briefing_capacity
  CHECK (briefing_used + briefing_reserved <= briefing_limit);

CREATE OR REPLACE FUNCTION public.newsroom_reserve_ai_generation(
  p_site text,
  p_kind text,
  p_budget_date date DEFAULT current_date
)
RETURNS jsonb
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
DECLARE
  budget public.ai_generation_budget%ROWTYPE;
  remaining integer;
BEGIN
  IF p_kind NOT IN ('normal', 'breaking', 'briefing') THEN
    RAISE EXCEPTION 'unsupported generation kind: %', p_kind;
  END IF;

  INSERT INTO public.ai_generation_budget(site, budget_date)
  VALUES (p_site, p_budget_date)
  ON CONFLICT (site, budget_date) DO NOTHING;

  SELECT * INTO budget
  FROM public.ai_generation_budget
  WHERE site = p_site AND budget_date = p_budget_date
  FOR UPDATE;

  IF p_kind = 'normal' THEN
    IF budget.normal_used + budget.normal_reserved >= budget.normal_limit THEN
      RETURN jsonb_build_object('reserved', false, 'kind', p_kind, 'remaining', 0);
    END IF;
    UPDATE public.ai_generation_budget
      SET normal_reserved = normal_reserved + 1
      WHERE site = p_site AND budget_date = p_budget_date
      RETURNING normal_limit - normal_used - normal_reserved INTO remaining;
  ELSIF p_kind = 'breaking' THEN
    IF budget.breaking_used + budget.breaking_reserved >= budget.breaking_limit THEN
      RETURN jsonb_build_object('reserved', false, 'kind', p_kind, 'remaining', 0);
    END IF;
    UPDATE public.ai_generation_budget
      SET breaking_reserved = breaking_reserved + 1
      WHERE site = p_site AND budget_date = p_budget_date
      RETURNING breaking_limit - breaking_used - breaking_reserved INTO remaining;
  ELSE
    IF budget.briefing_used + budget.briefing_reserved >= budget.briefing_limit THEN
      RETURN jsonb_build_object('reserved', false, 'kind', p_kind, 'remaining', 0);
    END IF;
    UPDATE public.ai_generation_budget
      SET briefing_reserved = briefing_reserved + 1
      WHERE site = p_site AND budget_date = p_budget_date
      RETURNING briefing_limit - briefing_used - briefing_reserved INTO remaining;
  END IF;

  RETURN jsonb_build_object('reserved', true, 'kind', p_kind, 'remaining', GREATEST(remaining, 0));
END;
$$;

CREATE OR REPLACE FUNCTION public.newsroom_finalize_ai_generation(
  p_site text,
  p_kind text,
  p_success boolean,
  p_budget_date date DEFAULT current_date
)
RETURNS jsonb
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
DECLARE
  budget public.ai_generation_budget%ROWTYPE;
BEGIN
  IF p_kind NOT IN ('normal', 'breaking', 'briefing') THEN
    RAISE EXCEPTION 'unsupported generation kind: %', p_kind;
  END IF;

  SELECT * INTO budget
  FROM public.ai_generation_budget
  WHERE site = p_site AND budget_date = p_budget_date
  FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'budget row not found for site % on %', p_site, p_budget_date;
  END IF;

  IF p_kind = 'normal' THEN
    IF budget.normal_reserved <= 0 THEN RAISE EXCEPTION 'no normal reservation to finalize'; END IF;
    UPDATE public.ai_generation_budget SET
      normal_reserved = normal_reserved - 1,
      normal_used = normal_used + CASE WHEN p_success THEN 1 ELSE 0 END
    WHERE site = p_site AND budget_date = p_budget_date;
  ELSIF p_kind = 'breaking' THEN
    IF budget.breaking_reserved <= 0 THEN RAISE EXCEPTION 'no breaking reservation to finalize'; END IF;
    UPDATE public.ai_generation_budget SET
      breaking_reserved = breaking_reserved - 1,
      breaking_used = breaking_used + CASE WHEN p_success THEN 1 ELSE 0 END
    WHERE site = p_site AND budget_date = p_budget_date;
  ELSE
    IF budget.briefing_reserved <= 0 THEN RAISE EXCEPTION 'no briefing reservation to finalize'; END IF;
    UPDATE public.ai_generation_budget SET
      briefing_reserved = briefing_reserved - 1,
      briefing_used = briefing_used + CASE WHEN p_success THEN 1 ELSE 0 END
    WHERE site = p_site AND budget_date = p_budget_date;
  END IF;

  SELECT * INTO budget FROM public.ai_generation_budget WHERE site = p_site AND budget_date = p_budget_date;
  RETURN jsonb_build_object(
    'finalized', true,
    'success', p_success,
    'kind', p_kind,
    'normalUsed', budget.normal_used,
    'breakingUsed', budget.breaking_used,
    'briefingUsed', budget.briefing_used
  );
END;
$$;

REVOKE ALL ON FUNCTION public.newsroom_reserve_ai_generation(text, text, date) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.newsroom_finalize_ai_generation(text, text, boolean, date) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.newsroom_reserve_ai_generation(text, text, date) TO service_role;
GRANT EXECUTE ON FUNCTION public.newsroom_finalize_ai_generation(text, text, boolean, date) TO service_role;

COMMENT ON FUNCTION public.newsroom_reserve_ai_generation(text, text, date) IS
  'Atomically reserves one daily AI generation slot. Returns reserved=false when the hard cap is exhausted.';
COMMENT ON FUNCTION public.newsroom_finalize_ai_generation(text, text, boolean, date) IS
  'Consumes a reserved slot only after a successful generation; failures release the slot without charging usage.';
