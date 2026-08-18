-- BULK_ARTICLE_MAINTENANCE
-- AdSense Phase 5: repair the small set of currently indexable cloud articles
-- after a manual source-family and taxonomy audit.

-- 1) This city-budget article cited the Texas Tribune canonical URL and the
-- Texas Tribune feed URL as two source records. They are one publisher family,
-- so the page must not remain indexable as a multi-source synthesis.
UPDATE public.daily_articles AS article
   SET category = 'Tax & Spending',
       body_json = CASE
         WHEN article.body_json IS NOT NULL AND jsonb_typeof(article.body_json) = 'object'
           THEN jsonb_set(
             article.body_json,
             '{sources}',
             jsonb_build_array(
               jsonb_build_object(
                 'url', 'https://www.texastribune.org/2026/08/17/texas-city-budgets-cuts-tax-hikes/',
                 'label', 'The Texas Tribune — reporting source'
               )
             ),
             true
           )
         ELSE article.body_json
       END,
       quality_flags = ARRAY(
         SELECT DISTINCT flag
         FROM unnest(
           coalesce(article.quality_flags, ARRAY[]::text[])
           || ARRAY[
             'seo_false_multisource',
             'seo_noindex',
             'source_list_cleaned',
             'taxonomy_corrected'
           ]::text[]
         ) AS flag
       )
 WHERE article.slug = '2026-08-17-texas-cities-eye-property-tax-hikes-spending-cuts-amid-yawning-budget-gaps';

-- 2) The Ray Guy watch-list synthesis uses three different official Texas
-- athletics sources. Its sources are valid; only the public taxonomy was wrong.
UPDATE public.daily_articles AS article
   SET category = 'Sports',
       discover_category = 'Sports',
       quality_flags = ARRAY(
         SELECT DISTINCT flag
         FROM unnest(
           coalesce(article.quality_flags, ARRAY[]::text[])
           || ARRAY['taxonomy_corrected']::text[]
         ) AS flag
       )
 WHERE article.slug = '2026-08-17-texas-college-football-players-named-to-2026-ray-guy-award-watch-list';

-- 3) The cross-country synthesis contains several valid official athletics
-- sources, but its selected primary URL accidentally pointed to a Baylor men's
-- golf schedule. Remove that unrelated source and select Baylor's actual 2026
-- cross-country schedule as the primary record.
UPDATE public.daily_articles AS article
   SET category = 'Sports',
       discover_category = 'Sports',
       source_name = 'Baylor Athletics',
       source_url = 'https://baylorbears.com/news/2026/8/14/cross-country-announces-2026-schedule',
       body_json = CASE
         WHEN article.body_json IS NOT NULL
           AND jsonb_typeof(article.body_json) = 'object'
           AND jsonb_typeof(article.body_json->'sources') = 'array'
           THEN jsonb_set(
             article.body_json,
             '{sources}',
             coalesce(
               (
                 SELECT jsonb_agg(source_item)
                 FROM jsonb_array_elements(article.body_json->'sources') AS source_item
                 WHERE source_item->>'url' <> 'https://baylorbears.com/news/2026/8/6/mens-golf-mgolf-reveals-2026-27-schedule'
               ),
               '[]'::jsonb
             ),
             true
           )
         ELSE article.body_json
       END,
       quality_flags = ARRAY(
         SELECT DISTINCT flag
         FROM unnest(
           coalesce(article.quality_flags, ARRAY[]::text[])
           || ARRAY[
             'source_attribution_corrected',
             'source_list_cleaned',
             'taxonomy_corrected'
           ]::text[]
         ) AS flag
       )
 WHERE article.slug = '2026-08-18-texas-colleges-announce-2026-cross-country-schedules';

-- Clear the stale Baylor golf feed pointer and, when the correct cross-country
-- feed record exists, attach it to the repaired article.
UPDATE public.texas_news_feed
   SET internal_slug = NULL
 WHERE internal_slug = '2026-08-18-texas-colleges-announce-2026-cross-country-schedules'
   AND link = 'https://baylorbears.com/news/2026/8/6/mens-golf-mgolf-reveals-2026-27-schedule';

UPDATE public.texas_news_feed
   SET internal_slug = '2026-08-18-texas-colleges-announce-2026-cross-country-schedules'
 WHERE link = 'https://baylorbears.com/news/2026/8/14/cross-country-announces-2026-schedule';
