-- Current-main salvage of deterministic hyperlocal newsroom telemetry.
-- Layers on top of the existing news_source_health view without recreating it,
-- so later routing/publication-boundary migrations remain authoritative.

CREATE OR REPLACE FUNCTION public.infer_texas_geography(input_text text)
RETURNS jsonb
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  WITH t AS (
    SELECT lower(coalesce(input_text, '')) AS v
  ),
  match AS (
    SELECT *
    FROM (VALUES
      ('Houston','Harris County','Gulf Coast','houston|harris county'),
      ('Dallas','Dallas County','North Texas','dallas|dallas county'),
      ('Fort Worth','Tarrant County','North Texas','fort worth|tarrant county'),
      ('Austin','Travis County','Central Texas','austin|travis county'),
      ('San Antonio','Bexar County','South Central Texas','san antonio|bexar county'),
      ('Corpus Christi','Nueces County','Gulf Coast','corpus christi|nueces county'),
      ('Bastrop','Bastrop County','Central Texas','bastrop|bastrop county'),
      ('Kingsville','Kleberg County','South Texas','kingsville|kleberg county'),
      ('Galveston','Galveston County','Gulf Coast','galveston'),
      ('Texas City','Galveston County','Gulf Coast','texas city, texas|texas city, tx|texas city tx'),
      ('Webster','Harris County','Gulf Coast','webster'),
      ('Paris','Lamar County','North Texas','paris, texas|paris, tx|paris tx|lamar county'),
      ('Orange','Orange County','Southeast Texas','orange, texas|orange, tx|orange tx|orange county'),
      ('Sinton','San Patricio County','Coastal Bend','sinton|san patricio county'),
      ('Aubrey','Denton County','North Texas','aubrey|denton county'),
      ('Laredo','Webb County','South Texas','laredo|webb county'),
      ('El Paso','El Paso County','West Texas','el paso'),
      ('Amarillo','Potter County','Panhandle','amarillo|potter county'),
      ('Lubbock','Lubbock County','South Plains','lubbock|lubbock county'),
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

CREATE OR REPLACE VIEW public.hyperlocal_source_health
WITH (security_invoker = true)
AS
SELECT
  h.*,
  CASE
    WHEN h.health_status = 'never_seen' THEN 'check_feed_or_wait_for_first_item'
    WHEN h.health_status = 'stale' THEN 'repair_or_replace_source'
    WHEN h.health_status = 'quiet' THEN 'monitor'
    WHEN h.coverage_rate_7d < 10 AND h.items_7d >= 5 THEN 'review_relevance_or_routing'
    ELSE 'none'
  END AS recommended_action
FROM public.news_source_health h
WHERE
  lower(h.source_name) ~ '(city of|civic|hyperlocal|local government|community|mosquito|vector)'
  OR lower(coalesce(h.category, '')) ~ '(hyperlocal|local government|public-health|human-interest)'
ORDER BY
  CASE h.health_status
    WHEN 'never_seen' THEN 0
    WHEN 'stale' THEN 1
    WHEN 'quiet' THEN 2
    ELSE 3
  END,
  h.source_name;

CREATE OR REPLACE VIEW public.texas_news_geography
WITH (security_invoker = true)
AS
SELECT
  f.id,
  f.title,
  f.source,
  f.link,
  f.pub_date,
  g->>'city' AS city,
  g->>'county' AS county,
  g->>'region' AS region,
  CASE
    WHEN g->>'city' IS NOT NULL OR g->>'county' IS NOT NULL THEN 'deterministic_text_match'
    ELSE 'unresolved'
  END AS geography_status
FROM public.texas_news_feed f
CROSS JOIN LATERAL public.infer_texas_geography(
  coalesce(f.title, '') || ' ' || coalesce(f.description, '')
) g;

GRANT SELECT ON public.hyperlocal_source_health TO anon, authenticated, service_role;
GRANT SELECT ON public.texas_news_geography TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.infer_texas_geography(text) TO anon, authenticated, service_role;

COMMENT ON FUNCTION public.infer_texas_geography(text) IS
  'Conservative deterministic Texas city/county/region inference for newsroom telemetry. Unresolved text remains unresolved; no AI or guessed fallback geography.';
COMMENT ON VIEW public.hyperlocal_source_health IS
  'Hyperlocal subset of the canonical newsroom source-health view with deterministic recommended operational actions.';
COMMENT ON VIEW public.texas_news_geography IS
  'News-feed geography telemetry derived only from explicit deterministic Texas place-name matches.';
