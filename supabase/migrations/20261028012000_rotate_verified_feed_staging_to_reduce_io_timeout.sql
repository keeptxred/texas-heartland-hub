-- 2026-10-28: Feed cold-retirement staging only. The unmodified query
-- required 9.3s read-only before its own archive writes and was cancelled
-- by the PostgREST statement deadline (57014) after newsroom stage succeeded.
-- Explain ANALYZE with an 8-way shard matched all existing hard/soft-reference
-- predicates and found >=75 eligible results in 4.71s rather than 9.3s.
-- Every old feed ID is visited over eight successive 4-hour scheduled runs.
-- Final retirement still independently revalidates all references and JSONB.
-- No source data, published articles, grants or security predicates removed.
CREATE OR REPLACE FUNCTION public.stage_expired_free_tier_feed(p_limit integer DEFAULT 1000)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
 v_ids bigint[];
 v_group text;
 v_rows integer;
 v_norm integer;
 v_fetch integer;
BEGIN
 IF p_limit IS NULL OR p_limit NOT BETWEEN 1 AND 2000 THEN
   RAISE EXCEPTION 'Batch size must be 1..2000';
 END IF;
 IF NOT pg_catalog.pg_try_advisory_xact_lock(61012026,21) THEN
   RAISE EXCEPTION 'Cold archive maintenance is already running';
 END IF;
 IF EXISTS (SELECT 1 FROM private.feed_cold_batches) THEN
   RETURN jsonb_build_object('staged_feed',0,'pending_backup',true);
 END IF;
 IF EXISTS (SELECT 1 FROM private.free_tier_feed_staging_claims) THEN
   RAISE EXCEPTION 'Unexpected unreleased feed claims';
 END IF;
 WITH protected_soft AS MATERIALIZED (
  SELECT DISTINCT v.id_text::bigint id
  FROM public.news_event_facts f
  CROSS JOIN LATERAL pg_catalog.jsonb_array_elements_text(f.source_feed_item_ids) v(id_text)
  WHERE v.id_text ~ '^[0-9]+$'
  UNION
  SELECT pg_catalog.unnest(feed_item_ids)::bigint
  FROM public.news_event_reconciliation_holds
 ), selected AS MATERIALIZED (
  SELECT f.id FROM public.texas_news_feed f
  WHERE f.created_at < now()-interval '21 days'
    AND f.pub_date < now()-interval '21 days'
    AND f.internal_slug IS NULL AND f.texasdefined_slug IS NULL
    -- Rotating eight-way window keeps the expensive soft-reference/legacy
    -- publication checks unchanged but bounds their input each 4-hour cycle.
    -- Full coverage every 32h, no permanent first-page starvation.
    AND (f.id % 8) = (
      pg_catalog.floor(pg_catalog.date_part('epoch', pg_catalog.now()) / 14400)::bigint % 8
    )
    AND NOT EXISTS (SELECT 1 FROM protected_soft p WHERE p.id=f.id)
    AND NOT EXISTS (SELECT 1 FROM public.daily_articles d WHERE d.source_url=f.link)
    AND NOT EXISTS (SELECT 1 FROM public.texasdefined_articles d WHERE d.source_feed_id=f.id)
    AND NOT EXISTS (SELECT 1 FROM public.news_story_cluster_items d WHERE d.feed_item_id=f.id)
    AND NOT EXISTS (SELECT 1 FROM public.news_event_cluster_sources d WHERE d.feed_item_id=f.id)
    AND NOT EXISTS (SELECT 1 FROM public.news_event_article_updates d WHERE d.feed_item_id=f.id)
    AND NOT EXISTS (SELECT 1 FROM public.ai_rewrite_cache d WHERE d.feed_item_id=f.id)
    AND NOT EXISTS (SELECT 1 FROM public.ai_rewrite_failures d WHERE d.feed_item_id=f.id)
    AND NOT EXISTS (SELECT 1 FROM public.ai_rewrite_usage d WHERE d.feed_item_id=f.id)
    AND NOT EXISTS (SELECT 1 FROM public.ai_rewrite_manual_bypass d WHERE d.feed_item_id=f.id)
    AND NOT EXISTS (SELECT 1 FROM public.flyover_aug10_reconciliation d WHERE d.feed_id=f.id)
    AND NOT EXISTS (SELECT 1 FROM public.news_feed_normalization n WHERE n.duplicate_of_feed_item_id=f.id AND n.feed_item_id<>f.id)
  ORDER BY f.created_at,f.id
  LIMIT p_limit
  FOR UPDATE OF f SKIP LOCKED
 ), claims AS (
  INSERT INTO private.free_tier_feed_staging_claims(feed_id)
  SELECT id FROM selected
  ON CONFLICT (feed_id) DO NOTHING
  RETURNING feed_id
 )
 SELECT pg_catalog.array_agg(feed_id ORDER BY feed_id) INTO v_ids FROM claims;

 v_rows:=coalesce(pg_catalog.array_length(v_ids,1),0);
 IF v_rows=0 THEN RETURN jsonb_build_object('staged_feed',0,'pending_backup',false); END IF;
 v_group := 'auto-feed-'||pg_catalog.txid_current()::text;

 WITH ranked AS (
   SELECT f.*,row_number() over(ORDER BY f.id) rn
   FROM public.texas_news_feed f
   WHERE f.id=ANY(v_ids)
 ), grouped AS (
   SELECT v_group||':texas_news_feed:'||((rn-1)/100)::text archive_key,
     count(*)::integer record_count,
     pg_catalog.md5(pg_catalog.string_agg(id::text,',' ORDER BY id)) record_keys_md5,
     pg_catalog.jsonb_agg(pg_catalog.to_jsonb(ranked)-'rn' ORDER BY id) records
   FROM ranked GROUP BY (rn-1)/100
 )
 INSERT INTO private.feed_cold_batches(archive_key,source_table,record_count,record_keys_md5,records)
 SELECT archive_key,'texas_news_feed',record_count,record_keys_md5,records FROM grouped;

 WITH ranked AS (
   SELECT n.*,row_number() over(ORDER BY n.feed_item_id) rn
   FROM public.news_feed_normalization n WHERE n.feed_item_id=ANY(v_ids)
 ), grouped AS (
   SELECT v_group||':news_feed_normalization:'||((rn-1)/100)::text archive_key,
     count(*)::integer record_count,
     pg_catalog.md5(pg_catalog.string_agg(feed_item_id::text,',' ORDER BY feed_item_id)) record_keys_md5,
     pg_catalog.jsonb_agg(pg_catalog.to_jsonb(ranked)-'rn' ORDER BY feed_item_id) records
   FROM ranked GROUP BY (rn-1)/100
 )
 INSERT INTO private.feed_cold_batches(archive_key,source_table,record_count,record_keys_md5,records)
 SELECT archive_key,'news_feed_normalization',record_count,record_keys_md5,records FROM grouped;
 GET DIAGNOSTICS v_norm=ROW_COUNT;

 WITH ranked AS (
   SELECT s.*,row_number() over(ORDER BY s.feed_item_id) rn
   FROM public.newsroom_source_page_fetch_state s WHERE s.feed_item_id=ANY(v_ids)
 ), grouped AS (
   SELECT v_group||':newsroom_source_page_fetch_state:'||((rn-1)/100)::text archive_key,
     count(*)::integer record_count,
     pg_catalog.md5(pg_catalog.string_agg(feed_item_id::text,',' ORDER BY feed_item_id)) record_keys_md5,
     pg_catalog.jsonb_agg(pg_catalog.to_jsonb(ranked)-'rn' ORDER BY feed_item_id) records
   FROM ranked GROUP BY (rn-1)/100
 )
 INSERT INTO private.feed_cold_batches(archive_key,source_table,record_count,record_keys_md5,records)
 SELECT archive_key,'newsroom_source_page_fetch_state',record_count,record_keys_md5,records FROM grouped;
 GET DIAGNOSTICS v_fetch=ROW_COUNT;
 RETURN jsonb_build_object('staged_feed',v_rows,'normalization_batches',v_norm,'fetch_batches',v_fetch,'pending_backup',true);
END
$function$
;
