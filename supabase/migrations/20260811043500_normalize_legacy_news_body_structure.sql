-- Normalize legacy daily_articles rows that stored an entire multi-paragraph
-- article as a single paragraphs[] item under one generic section.
--
-- The shared article renderer now repairs malformed paragraph strings at render
-- time, but normalizing the stored JSON keeps the database shape correct for
-- every downstream consumer as well.

WITH malformed AS (
  SELECT
    slug,
    body,
    body_json,
    (
      SELECT jsonb_agg(to_jsonb(btrim(part)) ORDER BY ord)
      FROM regexp_split_to_table(COALESCE(body, ''), E'\n[[:space:]]*\n') WITH ORDINALITY AS p(part, ord)
      WHERE btrim(part) <> '' AND ord > 1
    ) AS repaired_paragraphs
  FROM public.daily_articles
  WHERE jsonb_typeof(body_json) = 'object'
    AND jsonb_typeof(body_json->'sections') = 'array'
    AND jsonb_array_length(body_json->'sections') = 1
    AND lower(COALESCE(body_json->'sections'->0->>'heading', '')) IN ('the story', 'overview', 'background', 'details')
    AND jsonb_typeof(body_json->'sections'->0->'paragraphs') = 'array'
    AND jsonb_array_length(body_json->'sections'->0->'paragraphs') = 1
    AND COALESCE(body, '') ~ E'\n[[:space:]]*\n'
)
UPDATE public.daily_articles AS d
SET body_json = jsonb_set(
  d.body_json,
  '{sections,0,paragraphs}',
  COALESCE(m.repaired_paragraphs, '[]'::jsonb),
  true
)
FROM malformed AS m
WHERE d.slug = m.slug
  AND jsonb_array_length(COALESCE(m.repaired_paragraphs, '[]'::jsonb)) > 0;

-- Give the Austin/Lockhart barbecue article true editorial structure rather
-- than leaving ten distinct ideas beneath one generic heading.
UPDATE public.daily_articles
SET body_json = jsonb_build_object(
  'updated', COALESCE(body_json->>'updated', '2026-08-09'),
  'intro', jsonb_build_array(split_part(body, E'\n\n', 1)),
  'sections', jsonb_build_array(
    jsonb_build_object(
      'heading', 'Why Austin ranked first and Lockhart second',
      'paragraphs', jsonb_build_array(
        split_part(body, E'\n\n', 2),
        split_part(body, E'\n\n', 3)
      )
    ),
    jsonb_build_object(
      'heading', 'What the ranking actually measures',
      'paragraphs', jsonb_build_array(
        split_part(body, E'\n\n', 4)
      )
    ),
    jsonb_build_object(
      'heading', 'Why the Austin-Lockhart rivalry helps Central Texas',
      'paragraphs', jsonb_build_array(
        split_part(body, E'\n\n', 5),
        split_part(body, E'\n\n', 6)
      )
    ),
    jsonb_build_object(
      'heading', 'Competition keeps Texas barbecue evolving',
      'paragraphs', jsonb_build_array(
        split_part(body, E'\n\n', 7),
        split_part(body, E'\n\n', 8)
      )
    ),
    jsonb_build_object(
      'heading', 'Why there is still no objective barbecue champion',
      'paragraphs', jsonb_build_array(
        split_part(body, E'\n\n', 9),
        split_part(body, E'\n\n', 10)
      )
    )
  ),
  'faq', COALESCE(body_json->'faq', '[]'::jsonb),
  'sources', COALESCE(body_json->'sources', '[]'::jsonb),
  'keyTakeaways', COALESCE(body_json->'keyTakeaways', '[]'::jsonb)
)
WHERE slug = '2026-08-09-austin-lockhart-bbq-ranking';
