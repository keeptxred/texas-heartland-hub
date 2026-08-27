-- Route the 17 Google News discovery feeds through the existing fixed-allowlist
-- Supabase RSS relay. Cloudflare Worker egress receives repeat Google 503s while
-- the same feeds are healthy from Supabase. This changes transport only; all
-- Texas-relevance, source-quality, clustering, verification, and publication
-- safeguards remain authoritative.

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
    ('Texas Local Oddities and Human Interest — Google News', 'google-local-oddities')
)
UPDATE public.content_sources AS cs
SET rss_url = 'https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay?feed=' || relay.feed_key
FROM relay
WHERE cs.source_name = relay.source_name;
