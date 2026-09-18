-- BULK_ARTICLE_MAINTENANCE
-- Stage stronger, reusable primary-subject candidates. None becomes canonical
-- until the common stored-hero visual audit accepts it.

UPDATE public.daily_articles
SET image_candidate_url = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/John_Cornyn_official_senate_portrait.jpg',
    image_candidate_alt_text = 'U.S. Sen. John Cornyn in an official 2017 Senate portrait; Cornyn is one of the Texas Republicans who publicly criticized Bo French in this article. Archive portrait, not the September 2026 controversy.',
    image_generation_status = 'pending',
    image_validation_note = 'hero-readiness recovery queued: exact named critic John Cornyn, using a public-domain U.S. Senate portrait, will be visually checked before becoming canonical.'
WHERE slug = '2026-09-14-several-texas-republicans-condemn-bo-french-s-racist-posts-calling-asian-student';

UPDATE public.daily_articles
SET image_candidate_url = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Texas_A%26M_University_-_Texarkana_Academic_and_Student_Services_Building.jpg',
    image_candidate_alt_text = 'Texas A&M University-Texarkana Academic and Student Services Building; representative campus photograph of the university building the new athletics complex, not the planned stadium or athletic facilities.',
    image_generation_status = 'pending',
    image_validation_note = 'hero-readiness recovery queued: exact Texas A&M University-Texarkana campus photograph, CC BY-SA 4.0, will be visually checked before becoming canonical.'
WHERE slug = '2026-08-08-tamu-texarkana-athletics-complex';

UPDATE public.daily_articles
SET image_candidate_url = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Flower_crown.jpg',
    image_candidate_alt_text = 'A flower crown, representative of the defining Frida-inspired dress element in the San Antonio Frida Fest record attempt; not the event itself.',
    image_generation_status = 'pending',
    image_validation_note = 'hero-readiness recovery queued: CC0 flower-crown photograph directly representing a defining physical element of the record attempt will be visually checked before becoming canonical.'
WHERE slug = '2026-08-09-san-antonio-frida-fest-record';
