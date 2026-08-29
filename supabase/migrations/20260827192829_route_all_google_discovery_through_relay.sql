-- Keep all Google News discovery inputs off direct Cloudflare Worker egress.
-- Production testing showed repeat HTTP 503s from Cloudflare to Google while
-- the same RSS queries are healthy through the existing Supabase fixed-allowlist
-- relay. This changes transport only; relevance, source-quality, clustering,
-- verification, publication-readiness, and publication-safety gates are unchanged.

WITH relay(source_name, feed_key) AS (
  VALUES
    ('Texas Executive Actions — Google News', 'google-executive-actions'),
    ('Texas Attorney General Actions — Google News', 'google-attorney-general'),
    ('Texas DPS and Wanted Notices — Google News', 'google-dps-wanted'),
    ('Texas City and County Decisions — Google News', 'google-city-county-decisions'),
    ('Texas Police Sheriff and Fire Notices — Google News', 'google-police-fire'),
    ('Texas Courts and Judicial Appointments — Google News', 'google-courts-appointments'),
    ('Texas Higher Education and Campus Actions — Google News', 'google-higher-education'),
    ('Texas Corporate Partnerships and Expansions — Google News', 'google-corporate-expansions'),
    ('Texas Grants and Workforce Investments — Google News', 'google-workforce-grants'),
    ('Texas Property and Records Alerts — Google News', 'google-property-alerts'),
    ('Texas Zoos Wildlife and Conservation — Google News', 'google-wildlife'),
    ('Texas Libraries Museums and Community Grants — Google News', 'google-libraries-museums'),
    ('Texas Awards Contests and Recognition — Google News', 'google-awards-recognition'),
    ('Texas Sports Recruiting and Partnerships — Google News', 'google-sports-recruiting'),
    ('Texas Sports Records and Honors — Google News', 'google-sports-records'),
    ('Texas Airports TSA and Travel — Google News', 'google-airports-travel'),
    ('Texas Local Oddities and Human Interest — Google News', 'google-local-oddities'),
    ('Texas Governor Primary Source — Google News', 'google-primary-governor'),
    ('Texas Attorney General Primary Source — Google News', 'google-primary-attorney-general'),
    ('Texas DPS Primary Source — Google News', 'google-primary-dps'),
    ('Texas Parks Wildlife Primary Source — Google News', 'google-primary-tpwd'),
    ('Texas Workforce Primary Source — Google News', 'google-primary-workforce'),
    ('Texas Emergency and Forest Service Primary Sources — Google News', 'google-primary-emergency'),
    ('Texas Transportation Primary Source — Google News', 'google-primary-txdot'),
    ('Texas Courts Primary Source — Google News', 'google-primary-courts'),
    ('Texas Education Primary Sources — Google News', 'google-primary-education'),
    ('Texas Comptroller Primary Source — Google News', 'google-primary-comptroller'),
    ('Texas Panhandle and South Plains — Regional Discovery', 'google-region-panhandle'),
    ('West Texas and Permian Basin — Regional Discovery', 'google-region-west-texas'),
    ('North Texas and Cross Timbers — Regional Discovery', 'google-region-north-texas'),
    ('East Texas and Piney Woods — Regional Discovery', 'google-region-east-texas'),
    ('Central Texas and Brazos Valley — Regional Discovery', 'google-region-central-texas'),
    ('Gulf Coast and Coastal Bend — Regional Discovery', 'google-region-gulf-coast'),
    ('South Texas and Rio Grande Valley — Regional Discovery', 'google-region-south-texas'),
    ('Hill Country and San Antonio Region — Regional Discovery', 'google-region-hill-country')
)
UPDATE public.content_sources AS cs
SET rss_url = 'https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay?feed=' || relay.feed_key
FROM relay
WHERE cs.source_name = relay.source_name;
