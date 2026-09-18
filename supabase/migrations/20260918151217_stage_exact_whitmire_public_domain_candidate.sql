-- BULK_ARTICLE_MAINTENANCE
-- Stage an exact, reusable John Whitmire photograph for the governed
-- stored-hero visual audit. Do not replace the currently approved hero until
-- the common vision gate accepts this candidate.

UPDATE public.daily_articles
SET image_candidate_url = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/2025_John_Whitmire_(cropped).jpg',
    image_candidate_alt_text = 'Houston Mayor John Whitmire in a 2025 U.S. Department of Housing and Urban Development archive photograph.'
WHERE slug = '2026-08-13-houston-mayor-john-whitmire-77-seeks-second-term-as-age-sparks-political-debate';

UPDATE public.daily_articles
SET image_candidate_url = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/2025_John_Whitmire_(cropped).jpg',
    image_candidate_alt_text = 'Houston Mayor John Whitmire in a 2025 U.S. Department of Housing and Urban Development archive photograph.'
WHERE slug = '2026-08-13-houston-mayor-john-whitmire-s-age-and-re-election-plans-spark-debate';
