-- BULK_ARTICLE_MAINTENANCE
-- Stage an exact named-owner photograph for the governed hero audit.
UPDATE public.daily_articles
SET image_candidate_url = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Tony_and_Elliott_Roosevelt_(c659bafc-9cb2-4cbe-b901-2d697eaefe01).jpg',
    image_candidate_alt_text = 'Elliott "Tony" Roosevelt Jr. with his father Elliott Roosevelt in a National Park Service archive photograph. Tony Roosevelt is the owner selling Rolling R Ranch; archive family photograph, not the Texas ranch listing.',
    image_generation_status = 'pending',
    image_validation_note = 'hero-readiness recovery queued: exact named owner Elliott "Tony" Roosevelt Jr. in a public-domain National Park Service archive photograph will be visually checked before becoming canonical.'
WHERE slug = '2026-08-08-fdr-grandson-rolling-r-ranch-sale';
