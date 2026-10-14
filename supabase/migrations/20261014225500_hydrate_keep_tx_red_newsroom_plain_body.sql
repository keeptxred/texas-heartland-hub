-- KeepTXRed newsroom publication integrity: do not allow a structured,
-- source-backed news article to persist with an empty plain-text body.
-- The existing daily_articles_require_body trigger validates structure but
-- does not hydrate daily_articles.body. Historical restoration migrations
-- frequently provide only body_json; newer publication routes supply both.
-- Only missing newsroom text is generated, never overwritten.
CREATE OR REPLACE FUNCTION public.hydrate_keep_tx_red_newsroom_plain_body()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
DECLARE
  v_intro text;
  v_sections text;
  v_faq text;
  v_takeaways text;
  v_body text;
BEGIN
  IF NEW.kind IS DISTINCT FROM 'news'
    OR NEW.author IS DISTINCT FROM 'Keep TX Red Newsroom'
    OR NULLIF(btrim(COALESCE(NEW.body, '')), '') IS NOT NULL
    OR jsonb_typeof(NEW.body_json) IS DISTINCT FROM 'object'
  THEN
    RETURN NEW;
  END IF;

  SELECT string_agg(v.value, ' ' ORDER BY v.ord)
  INTO v_intro
  FROM jsonb_array_elements_text(
    CASE WHEN jsonb_typeof(NEW.body_json->'intro') = 'array'
      THEN NEW.body_json->'intro' ELSE '[]'::jsonb END
  ) WITH ORDINALITY AS v(value, ord);

  SELECT string_agg(
    concat_ws(' ', v.section->>'heading',
      (SELECT string_agg(p.value, ' ' ORDER BY p.ord)
       FROM jsonb_array_elements_text(
         CASE WHEN jsonb_typeof(v.section->'paragraphs') = 'array'
           THEN v.section->'paragraphs' ELSE '[]'::jsonb END
       ) WITH ORDINALITY AS p(value, ord)),
      (SELECT string_agg(b.value, ' ' ORDER BY b.ord)
       FROM jsonb_array_elements_text(
         CASE WHEN jsonb_typeof(v.section->'bullets') = 'array'
           THEN v.section->'bullets' ELSE '[]'::jsonb END
       ) WITH ORDINALITY AS b(value, ord))
    ), ' ' ORDER BY v.ord
  )
  INTO v_sections
  FROM jsonb_array_elements(
    CASE WHEN jsonb_typeof(NEW.body_json->'sections') = 'array'
      THEN NEW.body_json->'sections' ELSE '[]'::jsonb END
  ) WITH ORDINALITY AS v(section, ord);

  SELECT string_agg(concat_ws(' ', v.faq->>'q', v.faq->>'a'), ' ' ORDER BY v.ord)
  INTO v_faq
  FROM jsonb_array_elements(
    CASE WHEN jsonb_typeof(NEW.body_json->'faq') = 'array'
      THEN NEW.body_json->'faq' ELSE '[]'::jsonb END
  ) WITH ORDINALITY AS v(faq, ord);

  SELECT string_agg(v.value, ' ' ORDER BY v.ord)
  INTO v_takeaways
  FROM jsonb_array_elements_text(
    CASE WHEN jsonb_typeof(NEW.body_json->'keyTakeaways') = 'array'
      THEN NEW.body_json->'keyTakeaways' ELSE '[]'::jsonb END
  ) WITH ORDINALITY AS v(value, ord);

  v_body := btrim(concat_ws(' ', v_intro, v_sections, v_faq, v_takeaways));
  IF length(v_body) >= 200 THEN
    NEW.body := v_body;
  END IF;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_hydrate_keep_tx_red_newsroom_plain_body ON public.daily_articles;
CREATE TRIGGER trg_hydrate_keep_tx_red_newsroom_plain_body
BEFORE INSERT OR UPDATE OF body, body_json, kind, author
ON public.daily_articles
FOR EACH ROW EXECUTE FUNCTION public.hydrate_keep_tx_red_newsroom_plain_body();

COMMENT ON FUNCTION public.hydrate_keep_tx_red_newsroom_plain_body()
IS 'Fill only an empty KeepTXRed newsroom body from the already-stored structured content, preserving authorship and dates.';
