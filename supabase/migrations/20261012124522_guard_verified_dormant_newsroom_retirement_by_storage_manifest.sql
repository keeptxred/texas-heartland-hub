-- Guarded source-control migration: never retire an unpublished newsroom row before
-- private immutable Storage read-back and exact source/child parity checks.
CREATE TABLE IF NOT EXISTS private.free_tier_newsroom_retention_runs (
 run_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 completed_at timestamptz NOT NULL DEFAULT now(),
 manifest_name text NOT NULL UNIQUE,
 archived_cluster_rows integer NOT NULL,
 retired_cluster_rows integer NOT NULL,
 database_bytes_at_retirement bigint NOT NULL
);
ALTER TABLE private.free_tier_newsroom_retention_runs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON private.free_tier_newsroom_retention_runs FROM PUBLIC,anon,authenticated;

CREATE OR REPLACE FUNCTION public.retire_verified_expired_free_tier_newsroom(
 p_manifest_name text,p_expected_clusters integer,p_expected_batches integer
)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=''
AS $fn$
DECLARE v_claim_count integer;v_archived_count integer;v_exact_count integer;
 v_guard_count integer;v_child_count integer;v_matched integer;v_retired integer;v_table text;
BEGIN
 IF NOT pg_catalog.pg_try_advisory_xact_lock(61012026,22) THEN
   RAISE EXCEPTION 'Newsroom archival is already in progress';
 END IF;
 IF p_manifest_name IS NULL OR
 p_manifest_name !~ '^postgres-cold/[0-9]{4}-[0-9]{2}-[0-9]{2}/manifest-[0-9a-f]{64}\.json$' THEN
   RAISE EXCEPTION 'Invalid private archive manifest';
 END IF;
 IF NOT EXISTS(
  SELECT 1 FROM storage.buckets b JOIN storage.objects o ON o.bucket_id=b.id
  WHERE b.id='shared-postgres-cold-archives' AND b.public IS FALSE
  AND o.name=p_manifest_name AND o.metadata->>'mimetype'='application/json'
 ) THEN RAISE EXCEPTION 'Private Storage manifest not found'; END IF;
 SELECT count(*) INTO v_claim_count FROM private.free_tier_newsroom_staging_claims;
 SELECT coalesce(sum(record_count),0) INTO v_archived_count
 FROM private.newsroom_cold_batches WHERE source_table='news_story_clusters';
 IF v_claim_count<1 OR v_claim_count>2000 OR v_claim_count<>v_archived_count
   OR v_claim_count<>p_expected_clusters
   OR (SELECT count(*) FROM private.newsroom_cold_batches)<>p_expected_batches THEN
     RAISE EXCEPTION 'Newsroom archive source, claims or manifest counts disagree';
 END IF;
 PERFORM 1 FROM public.news_story_clusters c
 JOIN private.free_tier_newsroom_staging_claims r ON r.cluster_id=c.id FOR UPDATE OF c;
 PERFORM 1 FROM public.news_publish_candidates p
 JOIN private.free_tier_newsroom_staging_claims r ON r.cluster_id=p.cluster_id FOR UPDATE OF p;
 PERFORM 1 FROM public.news_research_packets p
 JOIN private.free_tier_newsroom_staging_claims r ON r.cluster_id=p.cluster_id FOR UPDATE OF p;
 PERFORM 1 FROM public.news_story_cluster_items p
 JOIN private.free_tier_newsroom_staging_claims r ON r.cluster_id=p.cluster_id FOR UPDATE OF p;
 WITH original AS MATERIALIZED (
    SELECT (e.value->>'id')::uuid cluster_id,e.value payload
    FROM private.newsroom_cold_batches b
    CROSS JOIN LATERAL pg_catalog.jsonb_array_elements(b.records) e(value)
    WHERE b.source_table='news_story_clusters'
 )
 SELECT count(*) FILTER(WHERE c.id IS NOT NULL AND pg_catalog.to_jsonb(c)=a.payload),
        count(*) FILTER(WHERE c.id IS NOT NULL
         AND c.status='READY' AND c.published_article_id IS NULL AND c.published_at IS NULL
         AND c.first_seen_at<now()-interval '30 days'
         AND c.last_seen_at<now()-interval '14 days'
         AND NOT EXISTS(SELECT 1 FROM public.newsroom_generation_drafts d WHERE d.cluster_id=c.id)
         AND EXISTS(SELECT 1 FROM public.news_publish_candidates p WHERE p.cluster_id=c.id
                    AND p.status='PENDING' AND p.published_at IS NULL)
         AND NOT EXISTS(SELECT 1 FROM public.news_publish_candidates p WHERE p.cluster_id=c.id
                     AND (p.status<>'PENDING' OR p.published_at IS NOT NULL)))
 INTO v_exact_count,v_guard_count
 FROM original a LEFT JOIN public.news_story_clusters c ON c.id=a.cluster_id;
 IF v_exact_count<>v_claim_count OR v_guard_count<>v_claim_count THEN
   RAISE EXCEPTION 'Newsroom cluster changed or became publishable since archiving';
 END IF;
 FOR v_table IN SELECT unnest(ARRAY['news_publish_candidates','news_research_packets','news_story_cluster_items'])
 LOOP
   IF v_table='news_publish_candidates' THEN
     SELECT count(*) INTO v_child_count FROM public.news_publish_candidates n
     WHERE n.cluster_id IN(SELECT cluster_id FROM private.free_tier_newsroom_staging_claims);
     SELECT count(*) INTO v_matched FROM private.newsroom_cold_batches b
     CROSS JOIN LATERAL pg_catalog.jsonb_array_elements(b.records) e(value)
     JOIN public.news_publish_candidates n ON n.id=(e.value->>'id')::uuid
     WHERE b.source_table=v_table AND pg_catalog.to_jsonb(n)=e.value;
   ELSIF v_table='news_research_packets' THEN
     SELECT count(*) INTO v_child_count FROM public.news_research_packets n
     WHERE n.cluster_id IN(SELECT cluster_id FROM private.free_tier_newsroom_staging_claims);
     SELECT count(*) INTO v_matched FROM private.newsroom_cold_batches b
     CROSS JOIN LATERAL pg_catalog.jsonb_array_elements(b.records) e(value)
     JOIN public.news_research_packets n ON n.id=(e.value->>'id')::uuid
     WHERE b.source_table=v_table AND pg_catalog.to_jsonb(n)=e.value;
   ELSE
     SELECT count(*) INTO v_child_count FROM public.news_story_cluster_items n
     WHERE n.cluster_id IN(SELECT cluster_id FROM private.free_tier_newsroom_staging_claims);
     SELECT count(*) INTO v_matched FROM private.newsroom_cold_batches b
     CROSS JOIN LATERAL pg_catalog.jsonb_array_elements(b.records) e(value)
     JOIN public.news_story_cluster_items n ON n.id=(e.value->>'id')::uuid
     WHERE b.source_table=v_table AND pg_catalog.to_jsonb(n)=e.value;
   END IF;
   IF v_child_count<>v_matched OR
      v_matched<>(SELECT coalesce(sum(record_count),0) FROM private.newsroom_cold_batches WHERE source_table=v_table) THEN
      RAISE EXCEPTION 'Changed or unarchived newsroom child: %',v_table;
   END IF;
 END LOOP;
 DELETE FROM public.news_story_clusters c
 USING private.free_tier_newsroom_staging_claims claim WHERE c.id=claim.cluster_id;
 GET DIAGNOSTICS v_retired=ROW_COUNT;
 IF v_retired<>v_claim_count THEN RAISE EXCEPTION 'Newsroom retirement count mismatch'; END IF;
 INSERT INTO private.free_tier_newsroom_retention_runs
 (manifest_name,archived_cluster_rows,retired_cluster_rows,database_bytes_at_retirement)
 VALUES(p_manifest_name,v_claim_count,v_retired,pg_catalog.pg_database_size(pg_catalog.current_database()));
 TRUNCATE TABLE private.newsroom_cold_batches,private.free_tier_newsroom_staging_claims;
 RETURN jsonb_build_object('retired_clusters',v_retired,'storage_manifest',p_manifest_name);
END
$fn$;
REVOKE ALL ON FUNCTION public.retire_verified_expired_free_tier_newsroom(text,integer,integer) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.retire_verified_expired_free_tier_newsroom(text,integer,integer) TO service_role;
