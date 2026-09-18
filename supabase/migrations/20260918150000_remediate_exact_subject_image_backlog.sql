-- BULK_ARTICLE_MAINTENANCE
UPDATE public.daily_articles
SET featured_image_url = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Lupe_logo_jpeg.jpg',
    image_url = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Lupe_logo_jpeg.jpg',
    image_alt_text = 'La Unión del Pueblo Entero (LUPE) logo.',
    image_generation_status = 'ready',
    image_validation_note = 'Manual exact-subject remediation: exact LUPE organization logo from Wikimedia Commons, CC BY-SA 4.0; identifies the named organization and is not documentary photography of the reported event.',
    quality_flags = array_remove(coalesce(quality_flags, '{}'::text[]), 'image_requires_visual_validation')
WHERE slug = '2026-09-17-more-young-people-are-getting-involved-with-south-texas-civil-rights-group-amid-';

UPDATE public.daily_articles
SET featured_image_url = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/TXSE_logo_Sep_2024.svg',
    image_url = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/TXSE_logo_Sep_2024.svg',
    image_alt_text = 'Texas Stock Exchange (TXSE) logo.',
    image_generation_status = 'ready',
    image_validation_note = 'Manual exact-subject remediation: exact TXSE logo from Wikimedia Commons; public-domain simple text/geometric logo (PD-textlogo); identifies the named exchange and is not a photograph of the first-listing event.',
    quality_flags = array_remove(coalesce(quality_flags, '{}'::text[]), 'image_requires_visual_validation')
WHERE slug = '2026-09-10-texas-stock-exchange-first-primary-listings';
