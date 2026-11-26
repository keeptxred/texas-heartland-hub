-- Explicit shard selection only for the existing bounded, guarded feed archive.
-- No new eligible records, no writes and no duplicate PostgreSQL staging.
CREATE OR REPLACE FUNCTION public.snapshot_direct_cold_feed_shard(p_shard integer,p_limit integer)
RETURNS text LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO '' AS $fn$
DECLARE shard_ids text[]; ids text[]; payload text;
BEGIN
 IF p_shard IS NULL OR p_shard NOT BETWEEN 0 AND 31 OR p_limit IS NULL OR p_limit NOT BETWEEN 1 AND 50 THEN
  RAISE EXCEPTION 'Invalid direct feed shard or limit';
 END IF;
 PERFORM private.direct_cold_check_fk_contract();
 SELECT coalesce(array_agg(id::text ORDER BY id),ARRAY[]::text[]) INTO shard_ids
 FROM public.texas_news_feed WHERE id % 32 = p_shard;
 ids:=private.direct_cold_ids('feed',p_limit,shard_ids);
 payload:=private.direct_cold_payload('feed',ids)::text;
 IF octet_length(payload)>4000000 THEN RAISE EXCEPTION 'Direct snapshot exceeds bounded payload limit'; END IF;
 RETURN payload;
END
$fn$;
REVOKE ALL ON FUNCTION public.snapshot_direct_cold_feed_shard(integer,integer) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.snapshot_direct_cold_feed_shard(integer,integer) TO service_role;
