-- Hyperlocal newsroom observability and deterministic Texas geography tagging.
-- Keeps source-health diagnosis free and database-native.

CREATE OR REPLACE FUNCTION public.infer_texas_geography(input_text text)
RETURNS jsonb
LANGUAGE sql
IMMUTABLE
AS $$
  WITH t AS (SELECT lower(coalesce(input_text, '')) AS v),
  match AS (
    SELECT * FROM (VALUES
      ('Houston','Harris County','Gulf Coast','houston|harris county'),
      ('Dallas','Dallas County','North Texas','dallas|dallas county'),
      ('Fort Worth','Tarrant County','North Texas','fort worth|tarrant county'),
      ('Austin','Travis County','Central Texas','austin|travis county'),
      ('San Antonio','Bexar County','South Central Texas','san antonio|bexar county'),
      ('Corpus Christi','Nueces County','Gulf Coast','corpus christi|nueces county'),
      ('Bastrop','Bastrop County','Central Texas','bastrop'),
      ('Kingsville','Kleberg County','South Texas','kingsville|kleberg county'),
      ('Galveston','Galveston County','Gulf Coast','galveston'),
      ('Texas City','Galveston County','Gulf Coast','texas city'),
      ('Webster','Harris County','Gulf Coast','webster'),
      ('Paris','Lamar County','North Texas','paris, texas|paris tx|lamar county'),
      ('Orange','Orange County','Southeast Texas','orange, texas|orange tx|orange county'),
      ('Sinton','San Patricio County','Coastal Bend','sinton|san patricio county'),
      ('Aubrey','Denton County','North Texas','aubrey|denton county'),
      ('Laredo','Webb County','South Texas','laredo|webb county'),
      ('El Paso','El Paso County','West Texas','el paso'),
      ('Amarillo','Potter County','Panhandle','amarillo'),
      ('Lubbock','Lubbock County','South Plains','lubbock'),
      ('Waco','McLennan County','Central Texas','waco|mclennan county'),
      ('Tyler','Smith County','East Texas','tyler|smith county'),
      ('Beaumont','Jefferson County','Southeast Texas','beaumont|jefferson county'),
      ('Canyon Lake','Comal County','Hill Country','canyon lake|comal county'),
      ('Irving','Dallas County','North Texas','irving'),
      ('Richardson','Dallas County','North Texas','richardson'),
      ('Ingram','Kerr County','Hill Country','ingram|kerr county')
    ) AS x(city, county, region, pattern), t
    WHERE t.v ~ ('(^|[^a-z])(' || x.pattern || ')([^a-z]|$)')
    LIMIT 1
  )
  SELECT jsonb_build_object(
    'city', (SELECT city FROM match),
    'county', (SELECT county FROM match),
    'region', (SELECT region FROM match)
  );
$$;

CREATE OR REPLACE VIEW public.news_source_health AS
WITH enabled_sources AS (
  SELECT source_name, rss_url, category, enabled
  FROM public.content_sources
  WHERE enabled = true AND rss_url IS NOT NULL
), recent_feed AS (
  SELECT source,
    max(pub_date) AS latest_item_at,
    count(*) FILTER (WHERE pub_date >= now() - interval '24 hours') AS items_24h,
    count(*) FILTER (WHERE pub_date >= now() - interval '7 days') AS items_7d,
    count(*) FILTER (WHERE pub_date >= now() - interval '7 days' AND internal_slug IS NOT NULL AND btrim(internal_slug) <> '') AS covered_7d
  FROM public.texas_news_feed GROUP BY source
)
SELECT s.source_name, s.rss_url, s.category, f.latest_item_at,
  coalesce(f.items_24h,0) AS items_24h,
  coalesce(f.items_7d,0) AS items_7d,
  coalesce(f.covered_7d,0) AS covered_7d,
  CASE
    WHEN f.latest_item_at IS NULL THEN 'never_seen'
    WHEN f.latest_item_at < now() - interval '7 days' THEN 'stale'
    WHEN f.latest_item_at < now() - interval '48 hours' THEN 'quiet'
    ELSE 'healthy'
  END AS health_status,
  CASE WHEN coalesce(f.items_7d,0)=0 THEN 0 ELSE round((coalesce(f.covered_7d,0)::numeric/f.items_7d::numeric)*100,1) END AS coverage_rate_7d,
  (lower(s.source_name) ~ '(city of|civic|hyperlocal|local government|community|mosquito|vector)') AS hyperlocal_tier
FROM enabled_sources s LEFT JOIN recent_feed f ON lower(f.source)=lower(s.source_name);

CREATE OR REPLACE VIEW public.hyperlocal_source_health AS
SELECT *,
  CASE
    WHEN health_status='never_seen' THEN 'check_feed_or_wait_for_first_item'
    WHEN health_status='stale' THEN 'repair_or_replace_source'
    WHEN health_status='quiet' THEN 'monitor'
    WHEN coverage_rate_7d < 10 AND items_7d >= 5 THEN 'review_relevance_or_routing'
    ELSE 'none'
  END AS recommended_action
FROM public.news_source_health
WHERE hyperlocal_tier = true
ORDER BY CASE health_status WHEN 'never_seen' THEN 0 WHEN 'stale' THEN 1 WHEN 'quiet' THEN 2 ELSE 3 END, source_name;

CREATE OR REPLACE VIEW public.texas_news_geography AS
SELECT f.id, f.title, f.source, f.link, f.pub_date,
  g->>'city' AS city, g->>'county' AS county, g->>'region' AS region,
  CASE WHEN g->>'city' IS NOT NULL OR g->>'county' IS NOT NULL THEN 'deterministic_text_match' ELSE 'unresolved' END AS geography_status
FROM public.texas_news_feed f
CROSS JOIN LATERAL public.infer_texas_geography(coalesce(f.title,'') || ' ' || coalesce(f.description,'')) g;

GRANT SELECT ON public.hyperlocal_source_health TO anon, authenticated, service_role;
GRANT SELECT ON public.texas_news_geography TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.infer_texas_geography(text) TO anon, authenticated, service_role;

COMMENT ON VIEW public.hyperlocal_source_health IS 'Hyperlocal newsroom sources classified as healthy, quiet, stale, or never_seen with a deterministic recommended action.';
COMMENT ON VIEW public.texas_news_geography IS 'Deterministic city/county/region inference for Texas news feed items; unresolved rows remain explicit rather than guessed.';
