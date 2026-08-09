-- Stabilize the August 9 midday news batch on durable, openly licensed
-- photographic sources from Wikimedia Commons. Keep the article text and
-- editorial metadata unchanged while replacing brittle/hotlink-blocked images.
WITH fixes(slug, image_url, image_alt_text, image_validation_note) AS (
  VALUES
    ('2026-08-09-houston-flock-camera-backlash',
     'https://commons.wikimedia.org/wiki/Special:Redirect/file/ALPR%20-%20Flock%20Safety%20-%20Centerton%20AR.jpg',
     'Photograph of a Flock Safety automated license-plate reader mounted on a roadside pole.',
     'Wikimedia Commons photograph; source file: File:ALPR - Flock Safety - Centerton AR.jpg.'),
    ('2026-08-09-harris-county-minority-contracting-pressure',
     'https://commons.wikimedia.org/wiki/Special:Redirect/file/HarrisCountyAdministrationBuildingHoustonTX.JPG',
     'Photograph of the Harris County Administration Building in downtown Houston.',
     'Wikimedia Commons photograph; source file: File:HarrisCountyAdministrationBuildingHoustonTX.JPG.'),
    ('2026-08-09-san-antonio-ai-fake-legal-citations',
     'https://commons.wikimedia.org/wiki/Special:Redirect/file/Bexar%20County%20Courthouse%20%282023%29.jpg',
     'Photograph of the historic Bexar County Courthouse in downtown San Antonio.',
     'Wikimedia Commons photograph; source file: File:Bexar County Courthouse (2023).jpg.'),
    ('2026-08-09-alamo-heights-apartment-height-fight',
     'https://commons.wikimedia.org/wiki/Special:Redirect/file/Alamo%20Heights%20SA.JPG',
     'Photograph showing buildings in Alamo Heights, Texas.',
     'Wikimedia Commons photograph; source file: File:Alamo Heights SA.JPG.'),
    ('2026-08-09-heb-store-upgrades-texas',
     'https://commons.wikimedia.org/wiki/Special:Redirect/file/HEBMiTiendaNorthHouston.JPG',
     'Photograph of an H-E-B Mi Tienda grocery storefront in Houston, Texas.',
     'Wikimedia Commons photograph; source file: File:HEBMiTiendaNorthHouston.JPG.'),
    ('2026-08-09-dutch-bros-salad-go-texas-sites',
     'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dutch%20Bros%20Coffee%20%2854860187923%29.jpg',
     'Photograph of a Dutch Bros Coffee drive-thru in Tomball, Texas.',
     'Wikimedia Commons photograph; source file: File:Dutch Bros Coffee (54860187923).jpg.'),
    ('2026-08-09-houston-pride-parade-august-15',
     'https://commons.wikimedia.org/wiki/Special:Redirect/file/1984%20Gay%20Pride%20Parade%2C%20Houston%2C%20Texas.jpg',
     'Archival photograph of Houston Pride participants parading along Westheimer Road.',
     'Wikimedia Commons archival photograph of the Houston Gay Pride Parade; source file: File:1984 Gay Pride Parade, Houston, Texas.jpg.'),
    ('2026-08-09-el-mirador-san-antonio-legacy',
     'https://commons.wikimedia.org/wiki/Special:Redirect/file/San%20Antonio%20historic%20King%20William%20District%20%284766989142%29.jpg',
     'Photograph of the historic King William District beside San Antonio Southtown.',
     'Wikimedia Commons neighborhood photograph used as contextual Southtown imagery; source file: File:San Antonio historic King William District (4766989142).jpg.'),
    ('2026-08-09-austin-lockhart-bbq-ranking',
     'https://commons.wikimedia.org/wiki/Special:Redirect/file/Lockhart%2C%20Texas%20BBQ%20and%20Big%20Red%20at%20Kreuz.jpg',
     'Photograph of Texas barbecue and Big Red at Kreuz Market in Lockhart.',
     'Wikimedia Commons photograph; source file: File:Lockhart, Texas BBQ and Big Red at Kreuz.jpg.'),
    ('2026-08-09-terrence-howard-edinburg-visit',
     'https://commons.wikimedia.org/wiki/Special:Redirect/file/Edinburg%2C%20TX%2C%20USA%20-%20panoramio%20-%20Mig%20Esc%20%282%29.jpg',
     'Photograph of Edinburg City Hall in Edinburg, Texas.',
     'Wikimedia Commons photograph; source file: File:Edinburg, TX, USA - panoramio - Mig Esc (2).jpg.')
)
UPDATE public.daily_articles AS article
SET featured_image_url = fixes.image_url,
    image_url = fixes.image_url,
    image_alt_text = fixes.image_alt_text,
    image_validation_note = fixes.image_validation_note,
    image_generation_status = 'ready'
FROM fixes
WHERE article.slug = fixes.slug;

DO $$
DECLARE
  expected integer := 10;
  matched integer;
BEGIN
  SELECT count(*) INTO matched
  FROM public.daily_articles
  WHERE slug IN (
    '2026-08-09-houston-flock-camera-backlash',
    '2026-08-09-harris-county-minority-contracting-pressure',
    '2026-08-09-san-antonio-ai-fake-legal-citations',
    '2026-08-09-alamo-heights-apartment-height-fight',
    '2026-08-09-heb-store-upgrades-texas',
    '2026-08-09-dutch-bros-salad-go-texas-sites',
    '2026-08-09-houston-pride-parade-august-15',
    '2026-08-09-el-mirador-san-antonio-legacy',
    '2026-08-09-austin-lockhart-bbq-ranking',
    '2026-08-09-terrence-howard-edinburg-visit'
  )
  AND featured_image_url LIKE 'https://commons.wikimedia.org/wiki/Special:Redirect/file/%'
  AND featured_image_url !~* '\.svg(?:$|[?#])';

  IF matched <> expected THEN
    RAISE EXCEPTION 'Aug. 9 midday stable-photo migration expected % corrected rows, found %', expected, matched;
  END IF;
END $$;
