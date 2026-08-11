-- Prevent database-fed news articles from rendering as a single wall of text.
-- Some publication migrations stored a multi-paragraph body as one JSON paragraph
-- containing embedded blank lines. HTML collapses those line breaks inside <p>, so
-- normalize paragraph-bearing JSON arrays at the database boundary and backfill
-- existing rows. Also give the Austin/Lockhart BBQ story meaningful sections.

CREATE OR REPLACE FUNCTION public.normalize_article_body_json(input_body jsonb)
RETURNS jsonb
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  result_body jsonb := input_body;
  normalized_intro jsonb := '[]'::jsonb;
  normalized_sections jsonb := '[]'::jsonb;
  normalized_paragraphs jsonb;
  item jsonb;
  section_item jsonb;
  piece text;
BEGIN
  IF input_body IS NULL OR jsonb_typeof(input_body) <> 'object' THEN
    RETURN input_body;
  END IF;

  IF jsonb_typeof(input_body->'intro') = 'array' THEN
    FOR item IN SELECT value FROM jsonb_array_elements(input_body->'intro')
    LOOP
      IF jsonb_typeof(item) = 'string' THEN
        FOR piece IN
          SELECT btrim(part)
          FROM regexp_split_to_table(item #>> '{}', E'\\n\\s*\\n+') AS part
          WHERE btrim(part) <> ''
        LOOP
          normalized_intro := normalized_intro || jsonb_build_array(to_jsonb(piece));
        END LOOP;
      ELSE
        normalized_intro := normalized_intro || jsonb_build_array(item);
      END IF;
    END LOOP;
    result_body := jsonb_set(result_body, '{intro}', normalized_intro, true);
  END IF;

  IF jsonb_typeof(input_body->'sections') = 'array' THEN
    FOR section_item IN SELECT value FROM jsonb_array_elements(input_body->'sections')
    LOOP
      IF jsonb_typeof(section_item->'paragraphs') = 'array' THEN
        normalized_paragraphs := '[]'::jsonb;
        FOR item IN SELECT value FROM jsonb_array_elements(section_item->'paragraphs')
        LOOP
          IF jsonb_typeof(item) = 'string' THEN
            FOR piece IN
              SELECT btrim(part)
              FROM regexp_split_to_table(item #>> '{}', E'\\n\\s*\\n+') AS part
              WHERE btrim(part) <> ''
            LOOP
              normalized_paragraphs := normalized_paragraphs || jsonb_build_array(to_jsonb(piece));
            END LOOP;
          ELSE
            normalized_paragraphs := normalized_paragraphs || jsonb_build_array(item);
          END IF;
        END LOOP;
        section_item := jsonb_set(section_item, '{paragraphs}', normalized_paragraphs, true);
      END IF;
      normalized_sections := normalized_sections || jsonb_build_array(section_item);
    END LOOP;
    result_body := jsonb_set(result_body, '{sections}', normalized_sections, true);
  END IF;

  RETURN result_body;
END;
$$;

CREATE OR REPLACE FUNCTION public.normalize_daily_article_body_json_trigger()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.body_json := public.normalize_article_body_json(NEW.body_json);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS normalize_daily_article_body_json_before_write ON public.daily_articles;
CREATE TRIGGER normalize_daily_article_body_json_before_write
BEFORE INSERT OR UPDATE OF body_json ON public.daily_articles
FOR EACH ROW
EXECUTE FUNCTION public.normalize_daily_article_body_json_trigger();

-- Repair all existing malformed body_json records, including the August 9 batch.
UPDATE public.daily_articles
SET body_json = public.normalize_article_body_json(body_json)
WHERE body_json IS NOT NULL;

-- Make the Austin vs. Lockhart BBQ article easier to scan by grouping its existing
-- reporting into editorial sections. This does not rewrite factual content; it only
-- restructures the already-published body into readable chunks.
WITH source AS (
  SELECT
    slug,
    body_json,
    regexp_split_to_array(body, E'\\n\\s*\\n+') AS p
  FROM public.daily_articles
  WHERE slug = '2026-08-09-austin-lockhart-bbq-ranking'
), rebuilt AS (
  SELECT
    slug,
    jsonb_set(
      jsonb_set(
        body_json,
        '{intro}',
        jsonb_build_array(p[1]),
        true
      ),
      '{sections}',
      jsonb_build_array(
        jsonb_build_object(
          'heading', 'Why Austin ranked first',
          'paragraphs', jsonb_build_array(p[2])
        ),
        jsonb_build_object(
          'heading', 'Why Lockhart still matters',
          'paragraphs', jsonb_build_array(p[3])
        ),
        jsonb_build_object(
          'heading', 'What the ranking really measures',
          'paragraphs', jsonb_build_array(p[4], p[5])
        ),
        jsonb_build_object(
          'heading', 'The upside and pressure of barbecue fame',
          'paragraphs', jsonb_build_array(p[6], p[7])
        ),
        jsonb_build_object(
          'heading', 'Central Texas still owns the argument',
          'paragraphs', jsonb_build_array(p[8], p[9], p[10])
        )
      ),
      true
    ) AS body_json
  FROM source
  WHERE array_length(p, 1) >= 10
)
UPDATE public.daily_articles AS d
SET body_json = public.normalize_article_body_json(rebuilt.body_json)
FROM rebuilt
WHERE d.slug = rebuilt.slug;
