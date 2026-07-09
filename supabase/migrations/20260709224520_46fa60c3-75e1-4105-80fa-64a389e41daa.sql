-- 1. Purge current stub/empty articles from reader-visible kinds.
DELETE FROM public.daily_articles
WHERE kind IN ('news','ingested','evergreen','sports-nfl','sports-mlb','sports-nba')
  AND (
    body_json IS NULL
    OR (
      COALESCE(jsonb_array_length(body_json->'sections'), 0) = 0
      AND COALESCE(length(array_to_string(
        ARRAY(SELECT jsonb_array_elements_text(COALESCE(body_json->'intro','[]'::jsonb))),
        ' '
      )), 0) < 200
    )
  );

-- 2. Trigger: refuse to write an article of a reader-visible kind without a real body.
CREATE OR REPLACE FUNCTION public.daily_articles_require_body()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  intro_text text;
  section_count int;
BEGIN
  IF NEW.kind NOT IN ('news','ingested','evergreen','sports-nfl','sports-mlb','sports-nba') THEN
    RETURN NEW;
  END IF;

  IF NEW.body_json IS NULL THEN
    RAISE EXCEPTION 'daily_articles.body_json is required for kind=% (slug=%)', NEW.kind, NEW.slug;
  END IF;

  section_count := COALESCE(jsonb_array_length(NEW.body_json->'sections'), 0);
  intro_text := COALESCE(array_to_string(
    ARRAY(SELECT jsonb_array_elements_text(COALESCE(NEW.body_json->'intro','[]'::jsonb))),
    ' '
  ), '');

  IF section_count = 0 AND length(intro_text) < 200 THEN
    RAISE EXCEPTION 'daily_articles.body_json is too thin for kind=% (slug=%): need at least one section or a 200+ char intro', NEW.kind, NEW.slug;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_daily_articles_require_body ON public.daily_articles;
CREATE TRIGGER trg_daily_articles_require_body
BEFORE INSERT OR UPDATE ON public.daily_articles
FOR EACH ROW EXECUTE FUNCTION public.daily_articles_require_body();