-- BULK_ARTICLE_MAINTENANCE
-- Final two published rows found by the semantic image audit. Use legally reusable,
-- truthful archive photography and explicitly describe representative context.

UPDATE public.daily_articles
SET featured_image_url='https://commons.wikimedia.org/wiki/Special:Redirect/file/Entrance_to_San_Antonio_Zoo_IMG_3110.JPG',
    image_url='https://commons.wikimedia.org/wiki/Special:Redirect/file/Entrance_to_San_Antonio_Zoo_IMG_3110.JPG',
    image_alt_text='San Antonio Zoo entrance in San Antonio, Texas — representative archive photograph for the Dinos After Dark crowd-management story',
    image_generation_status='ready',
    image_validation_note='Primary-subject remediation: replaced a failed synthetic nighttime dinosaur scene with an actual San Antonio Zoo entrance photograph. Billy Hathorn/Wikimedia Commons, CC BY-SA 3.0. Exact named venue; representative archive image, not the August 2026 Dinos After Dark event or crowd conditions.',
    quality_flags=array_remove(coalesce(quality_flags,'{}'::text[]),'missing_image')
WHERE slug='2026-08-09-san-antonio-zoo-dinos-after-dark-changes';

UPDATE public.daily_articles
SET featured_image_url='https://commons.wikimedia.org/wiki/Special:Redirect/file/RGV_First_Panel_Installation_-_49133213617.jpg',
    image_url='https://commons.wikimedia.org/wiki/Special:Redirect/file/RGV_First_Panel_Installation_-_49133213617.jpg',
    image_alt_text='Construction workers installing a Texas Rio Grande levee border wall system — representative archive photograph for the Presidio ruling story',
    image_generation_status='ready',
    image_validation_note='Primary-subject remediation: replaced a failed generic border-fence image with an actual CBP photograph of workers installing a Texas Rio Grande levee border wall system. CBP Photography/Wikimedia Commons, U.S. federal-government public domain. Exact infrastructure type; representative Rio Grande Valley archive image, not the Presidio project or the 2026 court proceeding.',
    quality_flags=array_remove(coalesce(quality_flags,'{}'::text[]),'missing_image')
WHERE slug='2026-08-09-presidio-border-wall-levee-ruling';
