-- Readability Batch 6: repair previously published newsroom rows whose
-- structured body_json accidentally stored the entire raw body as one paragraph.
--
-- Safety constraints:
--   * only rows with the exact known defective shape are touched
--   * the single stored paragraph must byte-for-text equal daily_articles.body
--   * the raw body must already contain blank-line paragraph boundaries
--   * only body_json.sections[0].paragraphs is replaced
--   * slug, URL, title, dek, author, facts, publication dates, canonical metadata,
--     source attribution, images, and raw body text are not changed
--
-- This turns ["paragraph 1\n\nparagraph 2"] into
-- ["paragraph 1", "paragraph 2"] without rewriting any article wording.

WITH candidates AS (
  SELECT
    a.slug,
    (
      SELECT jsonb_agg(to_jsonb(btrim(piece)) ORDER BY ord)
      FROM regexp_split_to_table(a.body, E'\n[[:space:]]*\n') WITH ORDINALITY AS parts(piece, ord)
      WHERE btrim(piece) <> ''
    ) AS repaired_paragraphs
  FROM public.daily_articles AS a
  WHERE a.body IS NOT NULL
    AND a.body_json IS NOT NULL
    AND a.body ~ E'\n[[:space:]]*\n'
    AND jsonb_typeof(a.body_json -> 'sections') = 'array'
    AND jsonb_array_length(a.body_json -> 'sections') = 1
    AND jsonb_typeof(a.body_json -> 'sections' -> 0 -> 'paragraphs') = 'array'
    AND jsonb_array_length(a.body_json -> 'sections' -> 0 -> 'paragraphs') = 1
    AND (a.body_json -> 'sections' -> 0 -> 'paragraphs' ->> 0) = a.body
), repairable AS (
  SELECT slug, repaired_paragraphs
  FROM candidates
  WHERE repaired_paragraphs IS NOT NULL
    AND jsonb_typeof(repaired_paragraphs) = 'array'
    AND jsonb_array_length(repaired_paragraphs) > 1
)
UPDATE public.daily_articles AS a
SET body_json = jsonb_set(
  a.body_json,
  '{sections,0,paragraphs}',
  r.repaired_paragraphs,
  false
)
FROM repairable AS r
WHERE a.slug = r.slug;
