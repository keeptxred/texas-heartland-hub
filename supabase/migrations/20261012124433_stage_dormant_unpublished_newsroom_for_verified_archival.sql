-- Source of deployed service-role-only cold stage for dormant unpublished newsroom.
CREATE TABLE IF NOT EXISTS private.free_tier_newsroom_staging_claims (
 cluster_id uuid PRIMARY KEY,claimed_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE private.free_tier_newsroom_staging_claims ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON private.free_tier_newsroom_staging_claims FROM PUBLIC,anon,authenticated;
CREATE OR REPLACE FUNCTION public.stage_expired_free_tier_newsroom(p_limit integer DEFAULT 1000)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=''
AS $fn$
DECLARE v_ids uuid[];v_group text;v_rows integer;v_packets integer;v_candidates integer;v_items integer;
BEGIN
 IF p_limit IS NULL OR p_limit NOT BETWEEN 1 AND 2000 THEN RAISE EXCEPTION 'Archive batch must be 1..2000'; END IF;
 IF NOT pg_catalog.pg_try_advisory_xact_lock(61012026,22) THEN RAISE EXCEPTION 'Newsroom archive already in progress'; END IF;
 IF EXISTS(SELECT 1 FROM private.newsroom_cold_batches) THEN
   RETURN jsonb_build_object('staged_clusters',0,'pending_backup',true);
 END IF;
 IF EXISTS(SELECT 1 FROM private.free_tier_newsroom_staging_claims) THEN
   RAISE EXCEPTION 'Unreleased newsroom claim without backup';
 END IF;
 WITH candidates AS MATERIALIZED (
   SELECT c.id FROM public.news_story_clusters c
   WHERE c.status='READY' AND c.published_article_id IS NULL AND c.published_at IS NULL
     AND c.first_seen_at<now()-interval '30 days'
     AND c.last_seen_at<now()-interval '14 days'
     AND NOT EXISTS(SELECT 1 FROM public.newsroom_generation_drafts d WHERE d.cluster_id=c.id)
     AND EXISTS(SELECT 1 FROM public.news_publish_candidates p
       WHERE p.cluster_id=c.id AND p.status='PENDING' AND p.published_at IS NULL)
     AND NOT EXISTS(SELECT 1 FROM public.news_publish_candidates p
       WHERE p.cluster_id=c.id AND (p.status<>'PENDING' OR p.published_at IS NOT NULL))
   ORDER BY c.first_seen_at,c.id
   LIMIT p_limit FOR UPDATE OF c SKIP LOCKED
 ), claims AS (
   INSERT INTO private.free_tier_newsroom_staging_claims(cluster_id)
   SELECT id FROM candidates ON CONFLICT(cluster_id) DO NOTHING RETURNING cluster_id
 )
 SELECT pg_catalog.array_agg(cluster_id ORDER BY cluster_id) INTO v_ids FROM claims;
 v_rows:=coalesce(pg_catalog.array_length(v_ids,1),0);
 IF v_rows=0 THEN RETURN jsonb_build_object('staged_clusters',0,'pending_backup',false); END IF;
 v_group:='auto-newsroom-'||pg_catalog.txid_current()::text;

 WITH ranked AS (
   SELECT c.*,row_number() over(ORDER BY c.id) rn FROM public.news_story_clusters c WHERE c.id=ANY(v_ids)
 ), groups AS (
   SELECT v_group||':news_story_clusters:'||((rn-1)/100)::text archive_key,count(*)::integer record_count,
     pg_catalog.md5(pg_catalog.string_agg(id::text,',' ORDER BY id)) record_ids_md5,
     pg_catalog.jsonb_agg(pg_catalog.to_jsonb(ranked)-'rn' ORDER BY id) records FROM ranked GROUP BY (rn-1)/100
 )
 INSERT INTO private.newsroom_cold_batches(archive_key,source_table,record_count,record_ids_md5,records)
 SELECT archive_key,'news_story_clusters',record_count,record_ids_md5,records FROM groups;

 WITH ranked AS (
   SELECT n.*,row_number() over(ORDER BY n.id) rn FROM public.news_publish_candidates n WHERE n.cluster_id=ANY(v_ids)
 ), groups AS (
   SELECT v_group||':news_publish_candidates:'||((rn-1)/100)::text archive_key,count(*)::integer record_count,
     pg_catalog.md5(pg_catalog.string_agg(id::text,',' ORDER BY id)) record_ids_md5,
     pg_catalog.jsonb_agg(pg_catalog.to_jsonb(ranked)-'rn' ORDER BY id) records FROM ranked GROUP BY (rn-1)/100
 )
 INSERT INTO private.newsroom_cold_batches(archive_key,source_table,record_count,record_ids_md5,records)
 SELECT archive_key,'news_publish_candidates',record_count,record_ids_md5,records FROM groups;
 GET DIAGNOSTICS v_candidates=ROW_COUNT;

 WITH ranked AS (
   SELECT n.*,row_number() over(ORDER BY n.id) rn FROM public.news_research_packets n WHERE n.cluster_id=ANY(v_ids)
 ), groups AS (
   SELECT v_group||':news_research_packets:'||((rn-1)/100)::text archive_key,count(*)::integer record_count,
     pg_catalog.md5(pg_catalog.string_agg(id::text,',' ORDER BY id)) record_ids_md5,
     pg_catalog.jsonb_agg(pg_catalog.to_jsonb(ranked)-'rn' ORDER BY id) records FROM ranked GROUP BY (rn-1)/100
 )
 INSERT INTO private.newsroom_cold_batches(archive_key,source_table,record_count,record_ids_md5,records)
 SELECT archive_key,'news_research_packets',record_count,record_ids_md5,records FROM groups;
 GET DIAGNOSTICS v_packets=ROW_COUNT;

 WITH ranked AS (
   SELECT n.*,row_number() over(ORDER BY n.id) rn FROM public.news_story_cluster_items n WHERE n.cluster_id=ANY(v_ids)
 ), groups AS (
   SELECT v_group||':news_story_cluster_items:'||((rn-1)/100)::text archive_key,count(*)::integer record_count,
     pg_catalog.md5(pg_catalog.string_agg(id::text,',' ORDER BY id)) record_ids_md5,
     pg_catalog.jsonb_agg(pg_catalog.to_jsonb(ranked)-'rn' ORDER BY id) records FROM ranked GROUP BY (rn-1)/100
 )
 INSERT INTO private.newsroom_cold_batches(archive_key,source_table,record_count,record_ids_md5,records)
 SELECT archive_key,'news_story_cluster_items',record_count,record_ids_md5,records FROM groups;
 GET DIAGNOSTICS v_items=ROW_COUNT;
 RETURN jsonb_build_object('staged_clusters',v_rows,'candidate_batches',v_candidates,
    'packet_batches',v_packets,'item_batches',v_items,'pending_backup',true);
END
$fn$;
REVOKE ALL ON FUNCTION public.stage_expired_free_tier_newsroom(integer) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.stage_expired_free_tier_newsroom(integer) TO service_role;
