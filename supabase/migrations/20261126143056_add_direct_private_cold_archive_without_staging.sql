-- Direct cold archive recovery while PostgreSQL cannot afford duplicate staging.
-- No payload tables are created. No data is deleted by this migration.
-- Keep legacy staged RPCs unchanged. Private helpers and public RPCs are service-only.
CREATE OR REPLACE FUNCTION private.direct_cold_ids(p_kind text, p_limit integer, p_ids text[] DEFAULT NULL)
RETURNS text[] LANGUAGE plpgsql STABLE SET search_path TO '' AS $fn$
DECLARE v_ids text[];
BEGIN
 IF p_kind = 'feed' THEN
  IF p_limit NOT BETWEEN 1 AND 50 OR p_limit IS NULL THEN RAISE EXCEPTION 'Invalid direct feed limit'; END IF;
  WITH protected_soft AS MATERIALIZED (
   SELECT DISTINCT v.id_text::bigint id FROM public.news_event_facts f
    CROSS JOIN LATERAL pg_catalog.jsonb_array_elements_text(f.source_feed_item_ids) v(id_text)
    WHERE v.id_text ~ '^[0-9]+$'
   UNION SELECT pg_catalog.unnest(feed_item_ids)::bigint FROM public.news_event_reconciliation_holds
  )
  SELECT coalesce(array_agg(s.id::text ORDER BY s.id), ARRAY[]::text[]) INTO v_ids FROM (
   SELECT f.id FROM public.texas_news_feed f
   WHERE f.created_at < now()-interval '21 days' AND f.pub_date < now()-interval '21 days'
    AND f.internal_slug IS NULL AND f.texasdefined_slug IS NULL
    AND (CASE WHEN p_ids IS NULL THEN f.id % 32 = pg_catalog.floor(pg_catalog.date_part('epoch', now())/7200)::bigint % 32
         ELSE f.id=ANY(p_ids::bigint[]) END)
    AND NOT EXISTS(SELECT 1 FROM protected_soft p WHERE p.id=f.id)
    AND NOT EXISTS(SELECT 1 FROM public.daily_articles d WHERE d.source_url=f.link)
    AND NOT EXISTS(SELECT 1 FROM public.texasdefined_articles d WHERE d.source_feed_id=f.id)
    AND NOT EXISTS(SELECT 1 FROM public.news_story_cluster_items d WHERE d.feed_item_id=f.id)
    AND NOT EXISTS(SELECT 1 FROM public.news_event_cluster_sources d WHERE d.feed_item_id=f.id)
    AND NOT EXISTS(SELECT 1 FROM public.news_event_article_updates d WHERE d.feed_item_id=f.id)
    AND NOT EXISTS(SELECT 1 FROM public.ai_rewrite_cache d WHERE d.feed_item_id=f.id)
    AND NOT EXISTS(SELECT 1 FROM public.ai_rewrite_failures d WHERE d.feed_item_id=f.id)
    AND NOT EXISTS(SELECT 1 FROM public.ai_rewrite_usage d WHERE d.feed_item_id=f.id)
    AND NOT EXISTS(SELECT 1 FROM public.ai_rewrite_manual_bypass d WHERE d.feed_item_id=f.id)
    AND NOT EXISTS(SELECT 1 FROM public.flyover_aug10_reconciliation d WHERE d.feed_id=f.id)
    AND NOT EXISTS(SELECT 1 FROM public.news_feed_normalization n WHERE n.duplicate_of_feed_item_id=f.id AND n.feed_item_id<>f.id)
   ORDER BY f.created_at,f.id LIMIT p_limit
  ) s;
 ELSIF p_kind='newsroom' THEN
  IF p_limit NOT BETWEEN 1 AND 65 OR p_limit IS NULL THEN RAISE EXCEPTION 'Invalid direct newsroom limit'; END IF;
  SELECT coalesce(array_agg(s.id::text ORDER BY s.id), ARRAY[]::text[]) INTO v_ids FROM (
   SELECT c.id FROM public.news_story_clusters c
   WHERE c.status='READY' AND c.published_article_id IS NULL AND c.published_at IS NULL
    AND c.first_seen_at<now()-interval '30 days' AND c.last_seen_at<now()-interval '14 days'
    AND (p_ids IS NULL OR c.id=ANY(p_ids::uuid[]))
    AND NOT EXISTS(SELECT 1 FROM public.newsroom_generation_drafts d WHERE d.cluster_id=c.id)
    AND NOT EXISTS(SELECT 1 FROM public.newsroom_generation_drafts d JOIN public.news_publish_candidates p ON p.id=d.candidate_id WHERE p.cluster_id=c.id)
    AND EXISTS(SELECT 1 FROM public.news_publish_candidates p WHERE p.cluster_id=c.id AND p.status='PENDING' AND p.published_at IS NULL)
    AND NOT EXISTS(SELECT 1 FROM public.news_publish_candidates p WHERE p.cluster_id=c.id AND (p.status IS DISTINCT FROM 'PENDING' OR p.published_at IS NOT NULL))
   ORDER BY c.first_seen_at,c.id LIMIT p_limit
  ) s;
 ELSE RAISE EXCEPTION 'Unapproved archive kind'; END IF;
 RETURN v_ids;
END
$fn$;

CREATE OR REPLACE FUNCTION private.direct_cold_payload(p_kind text,p_ids text[])
RETURNS jsonb LANGUAGE plpgsql STABLE SET search_path TO '' AS $fn$
DECLARE v_records jsonb;
BEGIN
 IF p_kind='feed' THEN
  v_records := jsonb_build_object(
   'texas_news_feed', (SELECT coalesce(jsonb_agg(to_jsonb(t) ORDER BY t.id),'[]'::jsonb) FROM public.texas_news_feed t WHERE t.id=ANY(p_ids::bigint[])),
   'news_feed_normalization', (SELECT coalesce(jsonb_agg(to_jsonb(t) ORDER BY t.feed_item_id),'[]'::jsonb) FROM public.news_feed_normalization t WHERE t.feed_item_id=ANY(p_ids::bigint[])),
   'newsroom_source_page_fetch_state', (SELECT coalesce(jsonb_agg(to_jsonb(t) ORDER BY t.feed_item_id),'[]'::jsonb) FROM public.newsroom_source_page_fetch_state t WHERE t.feed_item_id=ANY(p_ids::bigint[])));
 ELSIF p_kind='newsroom' THEN
  v_records := jsonb_build_object(
   'news_story_clusters',(SELECT coalesce(jsonb_agg(to_jsonb(t) ORDER BY t.id),'[]'::jsonb) FROM public.news_story_clusters t WHERE t.id=ANY(p_ids::uuid[])),
   'news_publish_candidates',(SELECT coalesce(jsonb_agg(to_jsonb(t) ORDER BY t.id),'[]'::jsonb) FROM public.news_publish_candidates t WHERE t.cluster_id=ANY(p_ids::uuid[])),
   'news_research_packets',(SELECT coalesce(jsonb_agg(to_jsonb(t) ORDER BY t.id),'[]'::jsonb) FROM public.news_research_packets t WHERE t.cluster_id=ANY(p_ids::uuid[])),
   'news_story_cluster_items',(SELECT coalesce(jsonb_agg(to_jsonb(t) ORDER BY t.id),'[]'::jsonb) FROM public.news_story_cluster_items t WHERE t.cluster_id=ANY(p_ids::uuid[])));
 ELSE RAISE EXCEPTION 'Unapproved archive kind'; END IF;
 RETURN jsonb_build_object('format','direct-cold-v1','project','ftkznprjljkhymknvhye','kind',p_kind,'parent_ids',to_jsonb(p_ids),'records',v_records);
END
$fn$;

-- Guard against schema evolution silently cascading additional records.
CREATE OR REPLACE FUNCTION private.direct_cold_check_fk_contract()
RETURNS void LANGUAGE plpgsql STABLE SET search_path TO '' AS $fn$
DECLARE actual text[];
BEGIN
 SELECT coalesce(array_agg(c.conname::text ORDER BY c.conname),ARRAY[]::text[]) INTO actual
 FROM pg_catalog.pg_constraint c WHERE c.contype='f' AND c.confrelid IN (
  'public.news_story_clusters'::regclass,'public.texas_news_feed'::regclass,'public.news_publish_candidates'::regclass,
  'public.news_research_packets'::regclass,'public.news_story_cluster_items'::regclass,
  'public.news_feed_normalization'::regclass,'public.newsroom_source_page_fetch_state'::regclass);
 IF actual IS DISTINCT FROM ARRAY[
 'ai_rewrite_cache_feed_item_id_fkey','ai_rewrite_failures_feed_item_id_fkey','ai_rewrite_manual_bypass_feed_item_id_fkey',
 'ai_rewrite_usage_feed_item_id_fkey','flyover_aug10_reconciliation_feed_id_fkey','news_event_article_updates_feed_item_id_fkey',
 'news_event_cluster_sources_feed_item_id_fkey','news_feed_normalization_duplicate_of_feed_item_id_fkey',
 'news_feed_normalization_feed_item_id_fkey','news_publish_candidates_cluster_id_fkey','news_research_packets_cluster_id_fkey',
 'news_story_cluster_items_cluster_id_fkey','news_story_cluster_items_feed_item_id_fkey',
 'newsroom_generation_drafts_candidate_id_fkey','newsroom_generation_drafts_cluster_id_fkey',
 'newsroom_source_page_fetch_state_feed_item_id_fkey','texasdefined_articles_source_feed_id_fkey'
 ]::text[] THEN RAISE EXCEPTION 'Direct cold archive dependency contract changed'; END IF;
END
$fn$;

-- Return TEXT (not parsed JS JSON), preserving exact JSONB numeric precision.
CREATE OR REPLACE FUNCTION public.snapshot_direct_cold_records(p_kind text,p_limit integer)
RETURNS text LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO '' AS $fn$
DECLARE ids text[]; payload text;
BEGIN
 PERFORM private.direct_cold_check_fk_contract();
 ids:=private.direct_cold_ids(p_kind,p_limit);
 payload:=private.direct_cold_payload(p_kind,ids)::text;
 IF octet_length(payload)>4000000 THEN RAISE EXCEPTION 'Direct snapshot exceeds bounded payload limit'; END IF;
 RETURN payload;
END
$fn$;

-- The trusted runner downloads both immutable private objects, verifies
-- their SHA-256 and exact decompressed payload bytes, then passes those bytes
-- (NOT an independently reconstructed JSON document) here. This RPC checks
-- both object records, the manifest and all original records again under locks.
CREATE OR REPLACE FUNCTION public.verify_direct_cold_retirement(
 p_kind text,p_payload text,p_manifest text,p_manifest_name text,p_retire boolean DEFAULT false)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '' AS $fn$
DECLARE payload jsonb; manifest jsonb; ids text[]; n integer; v_deleted integer; v_object text; v_folder text; v_sha text; v_manifest_sha text; v_limit integer;
BEGIN
 IF p_kind IS NULL OR p_kind NOT IN ('feed','newsroom') OR p_retire IS NULL THEN RAISE EXCEPTION 'Invalid direct retirement kind or mode'; END IF;
 IF p_payload IS NULL OR p_manifest IS NULL OR octet_length(p_payload)>4000000 OR octet_length(p_manifest)>16000 THEN RAISE EXCEPTION 'Invalid bounded direct archive payload'; END IF;
 payload:=p_payload::jsonb; manifest:=p_manifest::jsonb;
 IF payload->>'format' IS DISTINCT FROM 'direct-cold-v1' OR payload->>'project' IS DISTINCT FROM 'ftkznprjljkhymknvhye' OR payload->>'kind' IS DISTINCT FROM p_kind
 OR jsonb_typeof(payload->'parent_ids') IS DISTINCT FROM 'array' THEN RAISE EXCEPTION 'Invalid direct snapshot identity'; END IF;
 SELECT coalesce(array_agg(value ORDER BY ord),ARRAY[]::text[]) INTO ids FROM jsonb_array_elements_text(payload->'parent_ids') WITH ORDINALITY e(value,ord);
 n:=cardinality(ids); v_limit:=CASE WHEN p_kind='feed' THEN 50 ELSE 65 END;
 IF n NOT BETWEEN 1 AND v_limit OR (SELECT count(DISTINCT x) FROM unnest(ids) x)<>n THEN RAISE EXCEPTION 'Invalid or duplicate direct snapshot parent IDs'; END IF;
 v_sha:=encode(sha256(convert_to(p_payload,'UTF8')),'hex');
 v_manifest_sha:=encode(sha256(convert_to(p_manifest,'UTF8')),'hex');
 IF p_manifest_name IS NULL OR p_manifest_name !~ '^postgres-cold/[0-9]{4}-[0-9]{2}-[0-9]{2}/manifest-[0-9a-f]{64}\.json$'
 OR right(p_manifest_name,69) IS DISTINCT FROM v_manifest_sha||'.json' THEN RAISE EXCEPTION 'Direct immutable manifest hash/name mismatch'; END IF;
 v_folder:=split_part(p_manifest_name,'/',1)||'/'||split_part(p_manifest_name,'/',2)||'/';
 v_object:=manifest->>'object_name';
 IF manifest->>'format' IS DISTINCT FROM 'direct-cold-v1' OR manifest->>'project' IS DISTINCT FROM 'ftkznprjljkhymknvhye'
 OR manifest->>'kind' IS DISTINCT FROM p_kind OR manifest->>'payload_sha256' IS DISTINCT FROM v_sha
 OR manifest->>'parent_count' IS DISTINCT FROM n::text OR manifest->>'payload_bytes' IS DISTINCT FROM octet_length(p_payload)::text
 OR coalesce(manifest->>'gzip_sha256','') !~ '^[0-9a-f]{64}$'
 OR v_object IS DISTINCT FROM v_folder||'direct-'||p_kind||'-'||(manifest->>'gzip_sha256')||'.json.gz'
 OR coalesce(manifest->>'compressed_bytes','') !~ '^[0-9]{1,8}$'
 OR (manifest->>'compressed_bytes')::bigint NOT BETWEEN 1 AND 4500000
 THEN RAISE EXCEPTION 'Direct manifest does not match snapshot'; END IF;
 IF NOT EXISTS(SELECT 1 FROM storage.buckets b WHERE b.id='shared-postgres-cold-archives' AND b.public IS FALSE)
 OR NOT EXISTS(SELECT 1 FROM storage.objects o WHERE o.bucket_id='shared-postgres-cold-archives' AND o.name=p_manifest_name AND o.metadata->>'mimetype'='application/json' AND o.metadata->>'size'=octet_length(p_manifest)::text)
 OR NOT EXISTS(SELECT 1 FROM storage.objects o WHERE o.bucket_id='shared-postgres-cold-archives' AND o.name=v_object AND o.metadata->>'mimetype'='application/gzip' AND o.metadata->>'size'=manifest->>'compressed_bytes')
 THEN RAISE EXCEPTION 'Verified direct private Storage objects missing or mismatched'; END IF;
 IF NOT pg_catalog.pg_try_advisory_xact_lock(61012026,21) OR NOT pg_catalog.pg_try_advisory_xact_lock(61012026,22) THEN RAISE EXCEPTION 'Cold maintenance already running'; END IF;
 IF EXISTS(SELECT 1 FROM private.feed_cold_batches) OR EXISTS(SELECT 1 FROM private.newsroom_cold_batches)
 OR EXISTS(SELECT 1 FROM private.free_tier_feed_staging_claims) OR EXISTS(SELECT 1 FROM private.free_tier_newsroom_staging_claims)
 THEN RAISE EXCEPTION 'Resume legacy staged claims before direct retirement'; END IF;
 -- Avoid waiting on a live newsroom writer. The age/soft-reference guards
 -- are rechecked after the parent and every archived child are locked.
 IF p_kind='feed' THEN
  LOCK TABLE public.daily_articles,public.news_event_facts,public.news_event_reconciliation_holds IN SHARE MODE NOWAIT;
  PERFORM 1 FROM public.texas_news_feed t WHERE t.id=ANY(ids::bigint[]) ORDER BY t.id FOR UPDATE NOWAIT;
  PERFORM 1 FROM public.news_feed_normalization t WHERE t.feed_item_id=ANY(ids::bigint[]) ORDER BY t.feed_item_id FOR UPDATE NOWAIT;
  PERFORM 1 FROM public.newsroom_source_page_fetch_state t WHERE t.feed_item_id=ANY(ids::bigint[]) ORDER BY t.feed_item_id FOR UPDATE NOWAIT;
 ELSE
  PERFORM 1 FROM public.news_story_clusters t WHERE t.id=ANY(ids::uuid[]) ORDER BY t.id FOR UPDATE NOWAIT;
  PERFORM 1 FROM public.news_publish_candidates t WHERE t.cluster_id=ANY(ids::uuid[]) ORDER BY t.id FOR UPDATE NOWAIT;
  PERFORM 1 FROM public.news_research_packets t WHERE t.cluster_id=ANY(ids::uuid[]) ORDER BY t.id FOR UPDATE NOWAIT;
  PERFORM 1 FROM public.news_story_cluster_items t WHERE t.cluster_id=ANY(ids::uuid[]) ORDER BY t.id FOR UPDATE NOWAIT;
 END IF;
 PERFORM private.direct_cold_check_fk_contract();
 IF private.direct_cold_ids(p_kind,v_limit,ids) IS DISTINCT FROM ids THEN RAISE EXCEPTION 'Direct snapshot parent changed or has protected references'; END IF;
 IF private.direct_cold_payload(p_kind,ids) IS DISTINCT FROM payload THEN RAISE EXCEPTION 'Direct snapshot parent or child JSON changed'; END IF;
 IF NOT p_retire THEN RETURN jsonb_build_object('verified',true,'retired',0,'parents',n,'manifest_name',p_manifest_name); END IF;
 IF p_kind='feed' THEN
  DELETE FROM public.texas_news_feed WHERE id=ANY(ids::bigint[]);
  GET DIAGNOSTICS v_deleted=ROW_COUNT;
  IF v_deleted<>n THEN RAISE EXCEPTION 'Direct feed retirement count mismatch'; END IF;
  INSERT INTO private.free_tier_feed_retention_runs(manifest_name,archived_feed_rows,retired_feed_rows,database_bytes_at_retirement)
   VALUES(p_manifest_name,n,v_deleted,pg_database_size(current_database()));
 ELSE
  DELETE FROM public.news_story_clusters WHERE id=ANY(ids::uuid[]);
  GET DIAGNOSTICS v_deleted=ROW_COUNT;
  IF v_deleted<>n THEN RAISE EXCEPTION 'Direct newsroom retirement count mismatch'; END IF;
  INSERT INTO private.free_tier_newsroom_retention_runs(manifest_name,archived_cluster_rows,retired_cluster_rows,database_bytes_at_retirement)
   VALUES(p_manifest_name,n,v_deleted,pg_database_size(current_database()));
 END IF;
 RETURN jsonb_build_object('verified',true,'retired',v_deleted,'parents',n,'manifest_name',p_manifest_name);
END
$fn$;

REVOKE ALL ON FUNCTION private.direct_cold_ids(text,integer,text[]),private.direct_cold_payload(text,text[]),private.direct_cold_check_fk_contract() FROM PUBLIC,anon,authenticated,service_role;
REVOKE ALL ON FUNCTION public.snapshot_direct_cold_records(text,integer),public.verify_direct_cold_retirement(text,text,text,text,boolean) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.snapshot_direct_cold_records(text,integer),public.verify_direct_cold_retirement(text,text,text,text,boolean) TO service_role;
