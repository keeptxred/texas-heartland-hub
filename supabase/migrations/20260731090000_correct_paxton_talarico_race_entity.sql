-- Correct an indexed editorial entity mismatch without changing the public URL.
-- Paxton and Talarico are candidates in the 2026 Texas U.S. Senate race;
-- Texas Senate District 8 is a separate state-legislative office.
UPDATE public.daily_articles
SET
  title = 'Texas U.S. Senate Race: Paxton and Talarico Compete for North Texas Voters',
  seo_headline = 'Paxton and Talarico Compete in the 2026 Texas U.S. Senate Race',
  dek = 'Ken Paxton and James Talarico are competing in Texas''s 2026 U.S. Senate election, with North Texas voters central to the statewide contest.',
  body = replace(
    replace(body, 'Texas Senate District 8', 'the 2026 Texas U.S. Senate race'),
    'Senate District 8',
    'the 2026 Texas U.S. Senate race'
  ),
  body_json = replace(
    replace(body_json::text, 'Texas Senate District 8', 'the 2026 Texas U.S. Senate race'),
    'Senate District 8',
    'the 2026 Texas U.S. Senate race'
  )::jsonb
WHERE slug = 'live-2026-07-09-senate-district-8-showdown-why-the-paxton-talarico-battle-in-collin-co-j37z7b';
