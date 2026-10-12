-- Service-role-only read-only archive export API. Never grants to anon/authenticated.

CREATE OR REPLACE FUNCTION public.list_private_cold_archive_batches(
  p_offset integer DEFAULT 0, p_limit integer DEFAULT 100
)
RETURNS TABLE(archive_kind text, archive_key text, source_table text, record_count integer, record_checksum text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path=''
AS $fn$
BEGIN
  IF p_offset IS NULL OR p_offset < 0 OR p_offset > 10000000
     OR p_limit IS NULL OR p_limit < 1 OR p_limit > 250 THEN
    RAISE EXCEPTION 'Invalid archive pagination';
  END IF;
  RETURN QUERY
    SELECT u.archive_kind, u.archive_key, u.source_table,u.record_count,u.record_checksum
    FROM (
      SELECT 'legislative'::text AS archive_kind,a.archive_key,'legislative_content_opportunities'::text AS source_table,a.record_count,a.record_ids_md5 AS record_checksum
      FROM private.legislative_opportunity_cold_batches a
      UNION ALL
      SELECT 'newsroom',a.archive_key,a.source_table,a.record_count,a.record_ids_md5
      FROM private.newsroom_cold_batches a
      UNION ALL
      SELECT 'feed',a.archive_key,a.source_table,a.record_count,a.record_keys_md5
      FROM private.feed_cold_batches a
    ) AS u
    ORDER BY u.archive_kind,u.archive_key
    OFFSET p_offset LIMIT p_limit;
END
$fn$;

CREATE OR REPLACE FUNCTION public.read_private_cold_archive_batch(
  p_kind text, p_key text
)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=''
AS $fn$
DECLARE v_data jsonb;
BEGIN
  IF p_key IS NULL OR length(p_key) < 1 OR length(p_key) > 350
     OR p_kind NOT IN ('legislative','newsroom','feed') THEN
    RAISE EXCEPTION 'Invalid archive batch request';
  END IF;
  IF p_kind = 'legislative' THEN
    SELECT jsonb_build_object(
       'archive_key',a.archive_key,'source_table','legislative_content_opportunities',
       'record_count',a.record_count,'record_checksum',a.record_ids_md5,
       'records',a.records
    ) INTO v_data FROM private.legislative_opportunity_cold_batches a WHERE a.archive_key=p_key;
  ELSIF p_kind = 'newsroom' THEN
    SELECT jsonb_build_object(
       'archive_key',a.archive_key,'source_table',a.source_table,
       'record_count',a.record_count,'record_checksum',a.record_ids_md5,
       'records',a.records
    ) INTO v_data FROM private.newsroom_cold_batches a WHERE a.archive_key=p_key;
  ELSE
    SELECT jsonb_build_object(
       'archive_key',a.archive_key,'source_table',a.source_table,
       'record_count',a.record_count,'record_checksum',a.record_keys_md5,
       'records',a.records
    ) INTO v_data FROM private.feed_cold_batches a WHERE a.archive_key=p_key;
  END IF;
  IF v_data IS NULL THEN
    RAISE EXCEPTION 'Archive batch not found';
  END IF;
  RETURN v_data;
END
$fn$;

REVOKE ALL ON FUNCTION public.list_private_cold_archive_batches(integer,integer) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.read_private_cold_archive_batch(text,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.list_private_cold_archive_batches(integer,integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.read_private_cold_archive_batch(text,text) TO service_role;

