-- Escalate only high-priority newsroom gaps that survive beyond the existing SLA.
-- This does not publish content. It creates durable operational alerts for the
-- existing OIDC-protected overdue-gap publisher and resolves them automatically
-- once the underlying gap is covered or no longer qualifies.

CREATE OR REPLACE FUNCTION public.sync_coverage_gap_alerts(
  p_min_priority integer DEFAULT 80,
  p_min_age_hours integer DEFAULT 10,
  p_limit integer DEFAULT 10
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  opened_count integer := 0;
  resolved_count integer := 0;
  candidate_count integer := 0;
BEGIN
  IF p_min_priority < 0 OR p_min_priority > 100 THEN
    RAISE EXCEPTION 'p_min_priority must be between 0 and 100';
  END IF;
  IF p_min_age_hours < 1 OR p_min_age_hours > 168 THEN
    RAISE EXCEPTION 'p_min_age_hours must be between 1 and 168';
  END IF;
  IF p_limit < 1 OR p_limit > 25 THEN
    RAISE EXCEPTION 'p_limit must be between 1 and 25';
  END IF;

  SELECT count(*) INTO candidate_count
  FROM public.news_coverage_gaps g
  WHERE g.gap_reason = 'article_generation_or_publish_gap'
    AND coalesce(g.coverage_priority, 0) >= p_min_priority
    AND g.pub_date < now() - make_interval(hours => p_min_age_hours);

  WITH candidates AS (
    SELECT g.id, g.title, g.source, g.pub_date, g.coverage_priority
    FROM public.news_coverage_gaps g
    WHERE g.gap_reason = 'article_generation_or_publish_gap'
      AND coalesce(g.coverage_priority, 0) >= p_min_priority
      AND g.pub_date < now() - make_interval(hours => p_min_age_hours)
    ORDER BY g.coverage_priority DESC, g.pub_date ASC
    LIMIT p_limit
  ), upserted AS (
    INSERT INTO public.publishing_alerts (
      incident_key,
      status,
      latest_published_at,
      message,
      updated_at
    )
    SELECT
      'coverage-gap-' || c.id::text,
      'open',
      c.pub_date,
      format(
        'High-priority newsroom coverage gap remains unpublished after %s hours. Priority %s. Source: %s. Story: %s',
        p_min_age_hours,
        coalesce(c.coverage_priority, 0),
        coalesce(c.source, 'unknown'),
        c.title
      ),
      now()
    FROM candidates c
    ON CONFLICT (incident_key) DO UPDATE
    SET
      status = 'open',
      resolved_at = NULL,
      latest_published_at = EXCLUDED.latest_published_at,
      message = EXCLUDED.message,
      updated_at = now()
    RETURNING 1
  )
  SELECT count(*) INTO opened_count FROM upserted;

  WITH resolved AS (
    UPDATE public.publishing_alerts a
    SET
      status = 'resolved',
      resolved_at = now(),
      updated_at = now()
    WHERE a.status = 'open'
      AND a.incident_key LIKE 'coverage-gap-%'
      AND NOT EXISTS (
        SELECT 1
        FROM public.news_coverage_gaps g
        WHERE ('coverage-gap-' || g.id::text) = a.incident_key
          AND g.gap_reason = 'article_generation_or_publish_gap'
          AND coalesce(g.coverage_priority, 0) >= p_min_priority
          AND g.pub_date < now() - make_interval(hours => p_min_age_hours)
      )
    RETURNING 1
  )
  SELECT count(*) INTO resolved_count FROM resolved;

  RETURN jsonb_build_object(
    'ok', true,
    'candidate_count', candidate_count,
    'alerts_opened_or_refreshed', opened_count,
    'alerts_resolved', resolved_count,
    'min_priority', p_min_priority,
    'min_age_hours', p_min_age_hours,
    'alert_limit', p_limit
  );
END;
$$;

REVOKE ALL ON FUNCTION public.sync_coverage_gap_alerts(integer, integer, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.sync_coverage_gap_alerts(integer, integer, integer) TO service_role;

COMMENT ON FUNCTION public.sync_coverage_gap_alerts(integer, integer, integer) IS
  'Upserts a capped set of high-priority overdue newsroom coverage alerts and resolves alerts whose gaps are no longer outstanding. Does not publish content.';
