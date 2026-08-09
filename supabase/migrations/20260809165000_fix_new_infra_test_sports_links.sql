-- Correct the sports hub target discovered by the new-infrastructure acceptance test.
UPDATE public.daily_articles
SET body_json = replace(body_json::text, '](/sports)', '](/texas-sports)')::jsonb,
    internal_links = (
      SELECT coalesce(jsonb_agg(
        CASE WHEN elem->>'href' = '/sports'
          THEN jsonb_build_object('href','/texas-sports','kind',coalesce(elem->>'kind','hub'),'label','Texas Sports')
          ELSE elem
        END
      ), '[]'::jsonb)
      FROM jsonb_array_elements(coalesce(internal_links,'[]'::jsonb)) elem
    )
WHERE slug IN (
  '2026-08-09-san-antonio-puffy-taco-race',
  '2026-08-09-kingston-flemings-youth-camp'
);
