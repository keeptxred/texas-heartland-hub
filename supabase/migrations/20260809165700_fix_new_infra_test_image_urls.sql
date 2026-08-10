-- Repair hero images for the 2026-08-09 new-infrastructure acceptance batch.
WITH fixes(slug, image_url) AS (
  VALUES
    ('2026-08-09-abbott-election-adviser-schatzline','https://raw.githubusercontent.com/keeptxred/texas-heartland-hub/main/public/images/news/generated/2026-08-09/abbott-election-adviser.svg'),
    ('2026-08-09-alebrije-bakery-return','https://raw.githubusercontent.com/keeptxred/texas-heartland-hub/main/public/images/news/generated/2026-08-09/alebrije-bakery-return.svg'),
    ('2026-08-09-daniella-guzman-kprc-return','https://raw.githubusercontent.com/keeptxred/texas-heartland-hub/main/public/images/news/generated/2026-08-09/daniella-guzman-kprc-return.svg'),
    ('2026-08-09-houston-ice-witness-released','https://raw.githubusercontent.com/keeptxred/texas-heartland-hub/main/public/images/news/generated/2026-08-09/houston-ice-witness-release.svg'),
    ('2026-08-09-kingston-flemings-youth-camp','https://raw.githubusercontent.com/keeptxred/texas-heartland-hub/main/public/images/news/generated/2026-08-09/kingston-flemings-camp.svg'),
    ('2026-08-09-montgomery-county-measles-outbreak','https://raw.githubusercontent.com/keeptxred/texas-heartland-hub/main/public/images/news/generated/2026-08-09/montgomery-measles-alert.svg'),
    ('2026-08-09-san-antonio-puffy-taco-race','https://raw.githubusercontent.com/keeptxred/texas-heartland-hub/main/public/images/news/generated/2026-08-09/puffy-taco-race.svg'),
    ('2026-08-09-screaming-goat-san-antonio','https://raw.githubusercontent.com/keeptxred/texas-heartland-hub/main/public/images/news/generated/2026-08-09/screaming-goat-san-antonio.svg'),
    ('2026-08-09-texas-childrens-pavilion-expansion','https://raw.githubusercontent.com/keeptxred/texas-heartland-hub/main/public/images/news/generated/2026-08-09/texas-childrens-expansion.svg'),
    ('2026-08-09-texas-data-center-audit-grid','https://raw.githubusercontent.com/keeptxred/texas-heartland-hub/main/public/images/news/generated/2026-08-09/data-center-audit-grid.svg')
)
UPDATE public.daily_articles a
SET featured_image_url = fixes.image_url,
    image_url = fixes.image_url
FROM fixes
WHERE a.slug = fixes.slug;
