-- BULK_ARTICLE_MAINTENANCE
-- Persist the final primary-subject image replacements from the September 12 semantic audit.

UPDATE public.daily_articles
SET featured_image_url = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Texas_A%26M_University_Academic_Building.jpg',
    image_url = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Texas_A%26M_University_Academic_Building.jpg',
    image_alt_text = 'Texas A&M University Academic Building in College Station.',
    image_generation_status = 'ready',
    image_validation_note = 'Primary-subject remediation: replaced a generated bulletin-board scene that could imply a fabricated campus display with an actual Texas A&M University Academic Building photograph. Wikimedia Commons file Texas A&M University Academic Building.jpg, Flickr-reviewed CC BY 2.0. Exact institution context; not a photograph of the SB 37 review meeting.',
    quality_flags = array_remove(coalesce(quality_flags, '{}'::text[]), 'missing_image')
WHERE slug = '2026-09-04-texas-am-core-curriculum-sb37';

UPDATE public.daily_articles
SET featured_image_url = 'https://www.nhc.noaa.gov/storm_graphics/AT05/AL052026_3day_cone.png',
    image_url = 'https://www.nhc.noaa.gov/storm_graphics/AT05/AL052026_3day_cone.png',
    image_alt_text = 'Official National Hurricane Center forecast graphic for Tropical Storm Edouard.',
    image_generation_status = 'ready',
    image_validation_note = 'Primary-subject remediation: replaced synthetic storm-landfall imagery with the official National Hurricane Center Tropical Storm Edouard forecast graphic. NOAA/NWS federal-government public-domain source; exact storm subject.',
    quality_flags = array_remove(coalesce(quality_flags, '{}'::text[]), 'missing_image')
WHERE slug = '2026-09-02-tropical-storm-edouard-makes-landfall-near-texas-louisiana-border';

UPDATE public.daily_articles
SET featured_image_url = 'https://www.nhc.noaa.gov/storm_graphics/AT05/AL052026_3day_cone.png',
    image_url = 'https://www.nhc.noaa.gov/storm_graphics/AT05/AL052026_3day_cone.png',
    image_alt_text = 'Official National Hurricane Center forecast graphic for Tropical Storm Edouard.',
    image_generation_status = 'ready',
    image_validation_note = 'Primary-subject remediation: replaced synthetic storm-landfall imagery with the official National Hurricane Center Tropical Storm Edouard forecast graphic. NOAA/NWS federal-government public-domain source; exact storm subject.',
    quality_flags = array_remove(coalesce(quality_flags, '{}'::text[]), 'missing_image')
WHERE slug = '2026-09-01-tropical-storm-edouard-makes-landfall-near-texas-louisiana-border';

UPDATE public.daily_articles
SET featured_image_url = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/TexasLotteryCommission.JPG',
    image_url = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/TexasLotteryCommission.JPG',
    image_alt_text = 'Texas Lottery Commission headquarters in Austin.',
    image_generation_status = 'ready',
    image_validation_note = 'Primary-subject remediation: replaced a generic generated courthouse with an actual photograph of the Texas Lottery Commission headquarters in Austin. Wikimedia Commons file TexasLotteryCommission.JPG; photographer released the image to the public domain. Exact agency subject; not the court proceeding.',
    quality_flags = array_remove(coalesce(quality_flags, '{}'::text[]), 'missing_image')
WHERE slug = '2026-08-21-former-texas-lottery-chief-heads-to-court-here-s-how-the-agency-s-troubles-unfol';

UPDATE public.daily_articles
SET featured_image_url = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dan_Patrick_Texas.jpg',
    image_url = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dan_Patrick_Texas.jpg',
    image_alt_text = 'Texas Lieutenant Governor Dan Patrick.',
    image_generation_status = 'ready',
    image_validation_note = 'Primary-subject remediation: replaced a generated school-library controversy scene with an actual photograph of Lt. Gov. Dan Patrick, the named policymaker proposing the penalties. Wikimedia Commons file Dan Patrick Texas.jpg, CC BY-SA 4.0. Exact named subject; not a photograph of a specific school library.',
    quality_flags = array_remove(coalesce(quality_flags, '{}'::text[]), 'missing_image')
WHERE slug = '2026-08-20-lt-gov-dan-patrick-proposes-penalties-for-schools-that-keep-vulgar-books-on-libr';
