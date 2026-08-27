-- Persist ingestion fetch diagnostics emitted by the existing pg_net-driven
-- ingest-feeds cron. This lets source health distinguish a reachable-but-empty
-- feed from a genuinely broken or never-checked source without paid monitoring.

CREATE TABLE IF NOT EXISTS public.news_source_fetch_state (
  source_name text PRIMARY KEY,
  source_url text NOT NULL,
  last_response_id bigint NOT NULL,
  last_checked_at timestamptz NOT NULL,
  last_status integer,
  last_item_count integer NOT NULL DEFAULT 0,
  last_error text,
  last_success_at timestamptz,
  consecutive_failures integer NOT NULL DEFAULT 0,
  consecutive_empty integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.news_source_fetch_state ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read newsroom source fetch state" ON public.news_source_fetch_state;
CREATE POLICY "Public can read newsroom source fetch state"
ON public.news_source_fetch_state
FOR SELECT
TO anon, authenticated
USING (true);

CREATE OR REPLACE FUNCTION public.capture_news_source_fetch_state()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, net
AS $$
DECLARE
  response_row record;
  diag_item jsonb;
  payload jsonb;
  captured integer := 0;
  source_label text;
  source_url_value text;
  status_value integer;
  count_value integer;
  error_value text;
BEGIN
  FOR response_row IN
    SELECT id, created, content
    FROM net._http_response
    WHERE created >= now() - interval '6 hours'
      AND status_code = 200
      AND content LIKE '%"diag"%'
      AND content LIKE '%"sourceCount"%'
    ORDER BY id ASC
  LOOP
    BEGIN
      payload := response_row.content::jsonb;
    EXCEPTION WHEN others THEN
      CONTINUE;
    END;

    IF coalesce((payload->>'ok')::boolean, false) IS NOT TRUE
       OR jsonb_typeof(payload->'diag') <> 'array' THEN
      CONTINUE;
    END IF;

    FOR diag_item IN SELECT value FROM jsonb_array_elements(payload->'diag')
    LOOP
      source_label := nullif(btrim(diag_item->>'source'), '');
      source_url_value := nullif(btrim(diag_item->>'url'), '');
      IF source_label IS NULL OR source_url_value IS NULL THEN
        CONTINUE;
      END IF;

      status_value := CASE WHEN (diag_item->>'status') ~ '^[0-9]+$' THEN (diag_item->>'status')::integer ELSE NULL END;
      count_value := CASE WHEN (diag_item->>'count') ~ '^[0-9]+$' THEN (diag_item->>'count')::integer ELSE 0 END;
      error_value := nullif(btrim(diag_item->>'error'), '');

      INSERT INTO public.news_source_fetch_state (
        source_name, source_url, last_response_id, last_checked_at,
        last_status, last_item_count, last_error, last_success_at,
        consecutive_failures, consecutive_empty, updated_at
      ) VALUES (
        source_label,
        source_url_value,
        response_row.id,
        response_row.created,
        status_value,
        count_value,
        error_value,
        CASE WHEN status_value BETWEEN 200 AND 299 THEN response_row.created ELSE NULL END,
        CASE WHEN status_value BETWEEN 200 AND 299 THEN 0 ELSE 1 END,
        CASE WHEN status_value BETWEEN 200 AND 299 AND count_value = 0 THEN 1 ELSE 0 END,
        now()
      )
      ON CONFLICT (source_name) DO UPDATE
      SET
        source_url = EXCLUDED.source_url,
        last_response_id = EXCLUDED.last_response_id,
        last_checked_at = EXCLUDED.last_checked_at,
        last_status = EXCLUDED.last_status,
        last_item_count = EXCLUDED.last_item_count,
        last_error = EXCLUDED.last_error,
        last_success_at = CASE
          WHEN EXCLUDED.last_status BETWEEN 200 AND 299 THEN EXCLUDED.last_checked_at
          ELSE public.news_source_fetch_state.last_success_at
        END,
        consecutive_failures = CASE
          WHEN EXCLUDED.last_status BETWEEN 200 AND 299 THEN 0
          ELSE public.news_source_fetch_state.consecutive_failures + 1
        END,
        consecutive_empty = CASE
          WHEN EXCLUDED.last_status BETWEEN 200 AND 299 AND EXCLUDED.last_item_count = 0
            THEN public.news_source_fetch_state.consecutive_empty + 1
          ELSE 0
        END,
        updated_at = now()
      WHERE EXCLUDED.last_response_id > public.news_source_fetch_state.last_response_id;

      IF FOUND THEN
        captured := captured + 1;
      END IF;
    END LOOP;
  END LOOP;

  RETURN jsonb_build_object('ok', true, 'source_states_captured', captured);
END;
$$;

CREATE OR REPLACE VIEW public.hyperlocal_source_health
WITH (security_invoker = true)
AS
SELECT
  h.*,
  f.last_checked_at AS fetch_checked_at,
  f.last_status AS fetch_status,
  f.last_item_count AS fetch_item_count,
  f.last_error AS fetch_error,
  f.last_success_at AS fetch_last_success_at,
  coalesce(f.consecutive_failures, 0) AS consecutive_fetch_failures,
  coalesce(f.consecutive_empty, 0) AS consecutive_empty_fetches,
  CASE
    WHEN f.source_name IS NULL THEN 'never_checked'
    WHEN f.last_checked_at < now() - interval '2 hours' THEN 'stale_check'
    WHEN coalesce(f.consecutive_failures, 0) >= 2 THEN 'broken'
    WHEN f.last_status BETWEEN 200 AND 299 AND f.last_item_count = 0 THEN 'quiet'
    WHEN f.last_status BETWEEN 200 AND 299 AND f.last_item_count > 0 THEN 'healthy'
    ELSE 'degraded'
  END AS fetch_health_status,
  CASE
    WHEN f.source_name IS NULL THEN 'wait_for_or_trigger_fetch'
    WHEN f.last_checked_at < now() - interval '2 hours' THEN 'check_ingestion_cron'
    WHEN coalesce(f.consecutive_failures, 0) >= 2 THEN 'repair_or_replace_source'
    WHEN f.last_status BETWEEN 200 AND 299 AND f.last_item_count = 0 THEN 'monitor_quiet_feed'
    WHEN h.coverage_rate_7d < 10 AND h.items_7d >= 5 THEN 'review_relevance_or_routing'
    ELSE 'none'
  END AS recommended_action
FROM public.news_source_health h
LEFT JOIN public.news_source_fetch_state f
  ON lower(f.source_name) = lower(h.source_name)
WHERE
  lower(h.source_name) ~ '(city of|civic|hyperlocal|local government|community|mosquito|vector)'
  OR lower(coalesce(h.category, '')) ~ '(hyperlocal|local government|public-health|human-interest)'
ORDER BY
  CASE
    WHEN f.source_name IS NULL THEN 0
    WHEN coalesce(f.consecutive_failures, 0) >= 2 THEN 1
    WHEN f.last_checked_at < now() - interval '2 hours' THEN 2
    WHEN f.last_status BETWEEN 200 AND 299 AND f.last_item_count = 0 THEN 3
    ELSE 4
  END,
  h.source_name;

REVOKE ALL ON FUNCTION public.capture_news_source_fetch_state() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.capture_news_source_fetch_state() TO service_role;
GRANT SELECT ON public.news_source_fetch_state TO anon, authenticated, service_role;
GRANT SELECT ON public.hyperlocal_source_health TO anon, authenticated, service_role;

DO $$
DECLARE existing_job bigint;
BEGIN
  SELECT jobid INTO existing_job
  FROM cron.job
  WHERE jobname = 'newsroom-source-fetch-state-capture'
  LIMIT 1;
  IF existing_job IS NOT NULL THEN
    PERFORM cron.unschedule(existing_job);
  END IF;
  PERFORM cron.schedule(
    'newsroom-source-fetch-state-capture',
    '12,42 * * * *',
    $cron$SELECT public.capture_news_source_fetch_state();$cron$
  );
END;
$$;

COMMENT ON TABLE public.news_source_fetch_state IS
  'Latest ingestion fetch diagnostic per configured source, captured from existing pg_net ingest-feeds responses.';
COMMENT ON FUNCTION public.capture_news_source_fetch_state() IS
  'Captures source-level fetch status/count/error diagnostics from recent pg_net ingest-feeds responses without triggering additional fetches.';
