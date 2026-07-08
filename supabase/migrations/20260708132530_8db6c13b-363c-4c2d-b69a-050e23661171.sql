DELETE FROM public.daily_articles
WHERE kind = 'ingested'
  AND (body_json #>> '{sections,0,paragraphs,0}')
      LIKE '%affects Texans and is being tracked by the Keep TX Red newsroom%';