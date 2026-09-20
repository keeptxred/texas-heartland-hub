-- BULK_ARTICLE_MAINTENANCE
-- AdSense Phase 8: improve the actual reader value of the two weakest remaining
-- indexable sports articles. This repairs only supported editorial fields and
-- removes only the quality flags whose underlying issue is fixed below.

UPDATE public.daily_articles AS article
SET
  dek = 'Baylor, Houston, North Texas and Texas A&M released 2026 cross country schedules highlighting in-state meets and each program’s fall slate.',
  texas_impact_summary = 'The schedules map out when four Texas programs compete in-state, helping fans track local meets and showing where Baylor, Houston, North Texas and Texas A&M fit into the state’s fall running calendar.',
  body_json = CASE
    WHEN article.body_json IS NOT NULL AND jsonb_typeof(article.body_json) = 'object'
    THEN jsonb_set(
      article.body_json,
      '{keyTakeaways}',
      jsonb_build_array(
        'Baylor, Houston, North Texas and Texas A&M have released their 2026 cross country schedules.',
        'Baylor lists 10 regular-season events, including four meets in Texas.',
        'Houston opens at the Aggie Opener on Sept. 4, while North Texas lists six fall meets including a Sept. 4 event in Fort Worth.'
      ),
      true
    )
    ELSE article.body_json
  END,
  quality_flags = array_remove(coalesce(article.quality_flags, ARRAY[]::text[]), 'weak_dek')
WHERE article.slug = '2026-08-18-texas-colleges-announce-2026-cross-country-schedules';

UPDATE public.daily_articles AS article
SET
  texas_impact_summary = 'The watch list puts punters from Baylor, Texas A&M and TCU on a national award track, giving three Texas programs a shared preseason storyline to follow through December.',
  body_json = CASE
    WHEN article.body_json IS NOT NULL AND jsonb_typeof(article.body_json) = 'object'
    THEN jsonb_set(
      jsonb_set(
        article.body_json,
        '{keyTakeaways}',
        jsonb_build_array(
          'Palmer Williams of Baylor, Tyler White of Texas A&M and John Hoyet Chance of TCU were named to the 2026 Ray Guy Award watch list.',
          'The Ray Guy Award recognizes the nation’s top collegiate punter.',
          'The award winner is scheduled to be announced during the Home Depot College Football Awards in December.'
        ),
        true
      ),
      '{sections}',
      CASE
        WHEN EXISTS (
          SELECT 1
          FROM jsonb_array_elements(coalesce(article.body_json->'sections', '[]'::jsonb)) AS section
          WHERE lower(coalesce(section->>'heading', '')) = 'why this matters'
        )
        THEN coalesce(article.body_json->'sections', '[]'::jsonb)
        ELSE coalesce(article.body_json->'sections', '[]'::jsonb) || jsonb_build_array(
          jsonb_build_object(
            'heading', 'Why This Matters',
            'paragraphs', jsonb_build_array(
              'The preseason watch list gives three Texas programs a shared national special-teams storyline before the season begins. For Baylor, Texas A&M and TCU, punting field position can shape close games even when it receives less attention than offense or defense.',
              'Following the same award race across three in-state programs also gives readers a concrete way to compare how those specialists perform as the season progresses toward the December award announcement.'
            )
          )
        )
      END,
      true
    )
    ELSE article.body_json
  END,
  quality_flags = array_remove(coalesce(article.quality_flags, ARRAY[]::text[]), 'missing_why_this_matters')
WHERE article.slug = '2026-08-17-texas-college-football-players-named-to-2026-ray-guy-award-watch-list';
