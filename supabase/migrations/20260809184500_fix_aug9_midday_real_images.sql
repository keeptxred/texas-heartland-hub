-- Replace the August 9 midday publication batch's generic SVG placeholders with
-- real photographic hero images. This migration is intentionally update-only so
-- article text, metadata, source data, and internal links remain unchanged.
WITH fixes(slug, image_url, image_alt_text) AS (
  VALUES
    ('2026-08-09-houston-flock-camera-backlash',
     'https://erepublic.brightspotcdn.com/dims4/default/639d5b4/2147483647/strip/true/crop/7870x5249%2B0%2B0/resize/1600x900%21/quality/90/?url=http%3A%2F%2Ferepublic-brightspot.s3.us-west-2.amazonaws.com%2Fff%2F3e%2F40ce37424e908c95a3534ce65722%2Fflocksafety-falconhw-highway.jpg',
     'Photograph of a solar-powered automated license-plate reader beside a busy Texas roadway.'),
    ('2026-08-09-harris-county-minority-contracting-pressure',
     'https://bailbond.harriscountytx.gov/portals/bailbond/Images/67380066_trjEvDZeoMCK4vNRRNgeR3lpwtITHMU9lkDNmFBCnVs.jpg?ver=evc7sFUm1utqyTcMdBOGtw%3D%3D',
     'Photograph of the Harris County Administration Building in downtown Houston.'),
    ('2026-08-09-san-antonio-ai-fake-legal-citations',
     'https://commons.wikimedia.org/wiki/Special:Redirect/file/Bexar%20County%20Courthouse%20(2023).jpg',
     'Photograph of the historic Bexar County Courthouse in downtown San Antonio.'),
    ('2026-08-09-alamo-heights-apartment-height-fight',
     'https://livemagnoliaheights.com/assets/images/cache/magnolia_heights_parallax1-5f749f93c3c7ac2c13da6f3fc24cbb0a.jpg',
     'Photograph of a multi-story residential development in the Alamo Heights area of San Antonio.'),
    ('2026-08-09-heb-store-upgrades-texas',
     'https://imagescdn.homes.com/i2/3hOVMUzIUzLQ3V2TCGtZogcZZ1qXhpm8LVD6xgusZzk/117/frisco-frisco-tx-3-cityphoto.jpg',
     'Photograph of an H-E-B grocery store exterior in Texas.'),
    ('2026-08-09-dutch-bros-salad-go-texas-sites',
     'https://images1.loopnet.com/i2/YOQxfX8p1Wr82HN6TbUy1TuOe6vM9EhD-cU5onPYHVQ/112/6394-De-Zavala-Rd-San-Antonio-TX-Dutch-Bros-San-Antonio-TX_SL-Images-1-HighDefinition.jpg',
     'Photograph of a Dutch Bros drive-thru location in San Antonio, Texas.'),
    ('2026-08-09-houston-pride-parade-august-15',
     'https://s.hdnux.com/photos/01/50/72/71/27504227/6/rawImage.jpg',
     'Photograph of marchers celebrating during a Houston Pride parade downtown.'),
    ('2026-08-09-el-mirador-san-antonio-legacy',
     'https://sanantonio.culturemap.com/media-library/roasario-s-southtown-san-antonio.jpg',
     'Photograph of a longtime Southtown restaurant streetscape in San Antonio.'),
    ('2026-08-09-austin-lockhart-bbq-ranking',
     'https://images.squarespace-cdn.com/content/v1/545d5610e4b047a3e77efea8/1637705738272-MG7VMFXFMDE6KNU9W5AW/KreuzMarket-04187.jpg',
     'Photograph of a pitmaster working the wood-fired barbecue pits at Kreuz Market in Lockhart.'),
    ('2026-08-09-terrence-howard-edinburg-visit',
     'https://img.p.mapq.st/?q=75&url=https%3A%2F%2Fs3-media0.fl.yelpcdn.com%2Fbphoto%2FCVP0oBNbWjp_xAPXqqg_1w%2Fl.jpg',
     'Photograph of the municipal building in Edinburg, Texas, where the city hosted the official welcome.' )
)
UPDATE public.daily_articles AS article
SET featured_image_url = fixes.image_url,
    image_url = fixes.image_url,
    image_alt_text = fixes.image_alt_text,
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
  AND featured_image_url IS NOT NULL
  AND featured_image_url !~* '\\.svg(?:$|[?#])';

  IF matched <> expected THEN
    RAISE EXCEPTION 'Aug. 9 midday image remediation expected % corrected rows, found %', expected, matched;
  END IF;
END $$;
