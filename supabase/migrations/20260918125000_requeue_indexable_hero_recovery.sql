-- BULK_ARTICLE_MAINTENANCE
-- Requeue only current, indexable published stories whose heroes are held by the
-- primary-subject readiness gate. Candidates remain non-canonical until the
-- stored-hero visual audit accepts them. A rejected stored candidate gets one
-- strict generated-image recovery attempt from the readiness workflow.

UPDATE public.daily_articles
SET image_candidate_url = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Aerial_view_of_Texas_Medical_Center.jpg',
    image_candidate_alt_text = 'Aerial view of the Texas Medical Center hospital district in Houston, representative of Texas hospital systems; not a depiction of the Medicaid agreement itself.',
    image_generation_status = 'pending',
    image_validation_note = 'hero-readiness recovery queued: CC0 Texas Medical Center hospital-district candidate will be visually checked before becoming canonical.'
WHERE slug = '2026-09-18-texas-hospitals-to-receive-12-billion-in-medicaid-funds-ending-dispute-with-feds';

UPDATE public.daily_articles
SET image_generation_status = 'pending',
    image_validation_note = 'hero-readiness recovery queued: stored candidate will be rechecked and, if rejected, receive one strict generated-image recovery attempt.'
WHERE slug = '2026-09-17-more-young-people-are-getting-involved-with-south-texas-civil-rights-group-amid-';

UPDATE public.daily_articles
SET image_generation_status = 'pending',
    image_validation_note = 'hero-readiness recovery queued: stored candidate will be rechecked and, if rejected, receive one strict generated-image recovery attempt.'
WHERE slug = '2026-09-14-paxton-talarico-affordability-plans-compared';

UPDATE public.daily_articles
SET image_generation_status = 'pending',
    image_validation_note = 'hero-readiness recovery queued: stored candidate will be rechecked and, if rejected, receive one strict generated-image recovery attempt.'
WHERE slug = '2026-09-14-several-texas-republicans-condemn-bo-french-s-racist-posts-calling-asian-student';

UPDATE public.daily_articles
SET image_generation_status = 'pending',
    image_validation_note = 'hero-readiness recovery queued: stored candidate will be rechecked and, if rejected, receive one strict generated-image recovery attempt.'
WHERE slug = '2026-09-10-texas-stock-exchange-first-primary-listings';
