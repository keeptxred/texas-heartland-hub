-- Stagger the normalization step after ingestion, rather than dispatching
-- both high-volume jobs at the same second (previously both at 07/37).
-- Preserve the existing guarded endpoint/headers/request body exactly.
DO $ingest_schedule$
DECLARE
  existing_command text;
BEGIN
  SELECT command INTO existing_command
  FROM cron.job
  WHERE jobname = 'keep-tx-red-normalize-newsroom-feed';
  IF existing_command IS NULL
     OR existing_command NOT LIKE '%/api/public/hooks/normalize-newsroom-feed%'
  THEN
    RAISE EXCEPTION 'Cannot reschedule unexpected/missing news normalization job';
  END IF;

  PERFORM cron.schedule(
    'keep-tx-red-normalize-newsroom-feed',
    '10,40 * * * *',
    existing_command
  );
END;
$ingest_schedule$;
