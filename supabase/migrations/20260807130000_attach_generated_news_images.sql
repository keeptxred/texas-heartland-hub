-- Attach generated editorial hero images to the ten Texas news articles published on 2026-08-07.
-- Images are committed under public/images/news/generated and use stable site-relative URLs.

UPDATE public.daily_articles
SET
  featured_image_url = '/images/news/generated/abbott-data-center-grid-pause.jpg',
  image_url = '/images/news/generated/abbott-data-center-grid-pause.jpg',
  image_alt_text = 'Texas Capitol, power transmission lines and server racks representing Texas data-center grid demand.'
WHERE source_url = 'https://www.reuters.com/business/energy/texas-governor-orders-pause-new-data-center-approvals-pending-audit-2026-08-04/';

UPDATE public.daily_articles
SET
  featured_image_url = '/images/news/generated/harris-county-ice-investigation.jpg',
  image_url = '/images/news/generated/harris-county-ice-investigation.jpg',
  image_alt_text = 'Law enforcement outside a Houston government building representing the Harris County ICE shooting investigation.'
WHERE source_url = 'https://www.houstonchronicle.com/politics/houston/article/harris-county-lorenzo-salgado-araujo-22371668.php';

UPDATE public.daily_articles
SET
  featured_image_url = '/images/news/generated/texas-tax-free-weekend.jpg',
  image_url = '/images/news/generated/texas-tax-free-weekend.jpg',
  image_alt_text = 'Texas family shopping for school supplies and clothing during the state sales-tax holiday.'
WHERE source_url = 'https://www.houstonchronicle.com/news/houston-texas/trending/article/sales-tax-holiday-22375111.php';

UPDATE public.daily_articles
SET
  featured_image_url = '/images/news/generated/texas-hurricane-outlook.jpg',
  image_url = '/images/news/generated/texas-hurricane-outlook.jpg',
  image_alt_text = 'Storm clouds and rough surf along the Texas Gulf Coast representing the updated hurricane outlook.'
WHERE source_url = 'https://www.houstonchronicle.com/news/houston-weather/hurricanes/article/texas-hurricane-risk-drops-new-outlook-22376497.php';

UPDATE public.daily_articles
SET
  featured_image_url = '/images/news/generated/presidio-border-wall-ruling.jpg',
  image_url = '/images/news/generated/presidio-border-wall-ruling.jpg',
  image_alt_text = 'Border barrier sections beside a river and levee in a West Texas desert landscape near Presidio.'
WHERE source_url = 'https://apnews.com/article/a1534ab0dd9d0c1215d574dcd2098250';

UPDATE public.daily_articles
SET
  featured_image_url = '/images/news/generated/galveston-stairway-to-heaven.jpg',
  image_url = '/images/news/generated/galveston-stairway-to-heaven.jpg',
  image_alt_text = 'Tall wooden staircase rising from a Galveston beach at sunset, representing the viral Stairway to Heaven story.'
WHERE source_url = 'https://www.chron.com/gulf-coast/article/galveston-texas-beach-staircase-22369355.php';

UPDATE public.daily_articles
SET
  featured_image_url = '/images/news/generated/whataburger-76th-birthday.jpg',
  image_url = '/images/news/generated/whataburger-76th-birthday.jpg',
  image_alt_text = 'Texas family celebrating a burger restaurant 76th birthday with orange-and-white decorations.'
WHERE source_url = 'https://www.houstonchronicle.com/news/houston-texas/trending/article/whataburger-birthday-week-22373336.php';

UPDATE public.daily_articles
SET
  featured_image_url = '/images/news/generated/charley-crockett-data-center-dispute.jpg',
  image_url = '/images/news/generated/charley-crockett-data-center-dispute.jpg',
  image_alt_text = 'Country musician performing beside server racks and social-media imagery, representing the Texas data-center dispute.'
WHERE source_url = 'https://www.mysanantonio.com/entertainment/article/charley-crockett-san-antonio-22373678.php';

UPDATE public.daily_articles
SET
  featured_image_url = '/images/news/generated/brownsville-borderline-film.jpg',
  image_url = '/images/news/generated/brownsville-borderline-film.jpg',
  image_alt_text = 'Film crew working at night near a South Texas waterfront, representing the Brownsville-shot thriller Borderline.'
WHERE source_url = 'https://www.mysanantonio.com/entertainment/article/borderline-film-brownsville-22367038.php';

UPDATE public.daily_articles
SET
  featured_image_url = '/images/news/generated/fredericksburg-bomb-threat.jpg',
  image_url = '/images/news/generated/fredericksburg-bomb-threat.jpg',
  image_alt_text = 'Law-enforcement response outside a Hill Country shopping center, representing the Fredericksburg bomb-threat investigation.'
WHERE source_url = 'https://www.mysanantonio.com/news/hill-country/article/fredericksburg-walmart-bomb-threat-22377390.php';
