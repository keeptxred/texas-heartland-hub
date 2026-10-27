-- Already applied safely in shared Supabase production at version 20261027213152.
-- Disk I/O evidence (pg_stat_statements since 2026-10-06): news_event_facts
-- upserts generated ~609 MiB WAL; event-source upserts ~247 MiB.
-- Previous fact no-op trigger compared all columns, so every duplicate source
-- refresh with an updated last_seen_at caused full heap/index writes.
--
-- Keep recency meaningful: only skip identical fact data when last_seen_at
-- was refreshed in the last six hours; all changed confidence, conflicts,
-- provenance, corroboration, or other material fields persist immediately.
-- Existing trg_news_event_facts_updated_at remains unchanged.
--
-- Event-source association records carry no changing refresh timestamp;
-- skip only exact identical repeat upserts. Actual source changes persist.
SET lock_timeout = '3s';
CREATE OR REPLACE FUNCTION private.throttle_unchanged_news_event_fact_refresh()
RETURNS trigger LANGUAGE plpgsql
SET search_path = pg_catalog
AS $func$
BEGIN
  IF (pg_catalog.to_jsonb(NEW) - 'last_seen_at' - 'updated_at')
      IS NOT DISTINCT FROM
      (pg_catalog.to_jsonb(OLD) - 'last_seen_at' - 'updated_at')
      AND OLD.last_seen_at > pg_catalog.statement_timestamp() - interval '6 hours'
  THEN
    RETURN NULL;
  END IF;
  RETURN NEW;
END;
$func$;
REVOKE ALL ON FUNCTION private.throttle_unchanged_news_event_fact_refresh()
  FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS aaa_skip_noop_news_event_facts ON public.news_event_facts;
CREATE TRIGGER aaa_skip_noop_news_event_facts
BEFORE UPDATE ON public.news_event_facts
FOR EACH ROW EXECUTE FUNCTION private.throttle_unchanged_news_event_fact_refresh();
DROP TRIGGER IF EXISTS aaa_skip_noop_news_event_cluster_sources ON public.news_event_cluster_sources;
CREATE TRIGGER aaa_skip_noop_news_event_cluster_sources
BEFORE UPDATE ON public.news_event_cluster_sources
FOR EACH ROW EXECUTE FUNCTION private.skip_semantically_unchanged_update();
RESET lock_timeout;
