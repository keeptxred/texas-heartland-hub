-- Deployed hourly Free Plan capacity measurements. All existing publishing jobs stay active.

CREATE TABLE IF NOT EXISTS private.database_capacity_hourly (
  measured_hour timestamptz PRIMARY KEY,
  measured_at timestamptz NOT NULL DEFAULT now(),
  database_bytes bigint NOT NULL CHECK(database_bytes > 0),
  quota_status text NOT NULL CHECK(quota_status IN ('ok','warning','critical','over_limit'))
);
ALTER TABLE private.database_capacity_hourly ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON private.database_capacity_hourly FROM public, anon, authenticated;

CREATE OR REPLACE FUNCTION private.capture_database_capacity_hourly()
RETURNS bigint LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $fn$
DECLARE
 v_bytes bigint;
 v_status text;
BEGIN
 v_bytes := pg_catalog.pg_database_size(pg_catalog.current_database());
 v_status := CASE WHEN v_bytes >= 500000000 THEN 'over_limit'
                  WHEN v_bytes >= 475000000 THEN 'critical'
                  WHEN v_bytes >= 450000000 THEN 'warning'
                  ELSE 'ok' END;
 INSERT INTO private.database_capacity_hourly(measured_hour,measured_at,database_bytes,quota_status)
 VALUES (date_trunc('hour',now()),now(),v_bytes,v_status)
 ON CONFLICT(measured_hour)
 DO UPDATE SET measured_at=excluded.measured_at,
               database_bytes=excluded.database_bytes,
               quota_status=excluded.quota_status;
 DELETE FROM private.database_capacity_hourly
 WHERE measured_hour < now() - interval '90 days';
 PERFORM private.capture_database_capacity_daily();
 RETURN v_bytes;
END
$fn$;
REVOKE ALL ON FUNCTION private.capture_database_capacity_hourly() FROM public, anon, authenticated;

SELECT cron.alter_job(
  job_id := (SELECT jobid FROM cron.job WHERE jobname='free-tier-database-capacity-monitor'),
  schedule := '45 * * * *',
  command := 'SELECT private.capture_database_capacity_hourly()'
);

