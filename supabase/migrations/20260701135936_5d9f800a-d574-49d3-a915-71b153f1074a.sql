
ALTER TABLE public.daily_articles
  ADD COLUMN IF NOT EXISTS ctr_score integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS headline_variants jsonb,
  ADD COLUMN IF NOT EXISTS variant_a_impressions integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS variant_b_impressions integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS variant_a_clicks integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS variant_b_clicks integer NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION public.increment_variant_metric(_slug text, _variant text, _kind text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _variant NOT IN ('a','b') OR _kind NOT IN ('impression','click') THEN
    RETURN;
  END IF;
  IF _kind = 'impression' AND _variant = 'a' THEN
    UPDATE public.daily_articles SET variant_a_impressions = variant_a_impressions + 1 WHERE slug = _slug;
  ELSIF _kind = 'impression' AND _variant = 'b' THEN
    UPDATE public.daily_articles SET variant_b_impressions = variant_b_impressions + 1 WHERE slug = _slug;
  ELSIF _kind = 'click' AND _variant = 'a' THEN
    UPDATE public.daily_articles SET variant_a_clicks = variant_a_clicks + 1 WHERE slug = _slug;
  ELSIF _kind = 'click' AND _variant = 'b' THEN
    UPDATE public.daily_articles SET variant_b_clicks = variant_b_clicks + 1 WHERE slug = _slug;
  END IF;
END;
$$;
