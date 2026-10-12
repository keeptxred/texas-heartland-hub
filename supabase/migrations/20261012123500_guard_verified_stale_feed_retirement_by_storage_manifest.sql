-- Service-role-only, fail-closed feed retirement.
-- Executes ONLY after the exporter has downloaded and hash-verified a private Storage manifest.
CREATE TABLE IF NOT EXISTS private.free_tier_feed_retention_runs (
 run_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 completed_at timestamptz NOT NULL DEFAULT now(),
 manifest_name text NOT NULL UNIQUE,
 archived_feed_rows integer NOT NULL,
 retired_feed_rows integer NOT NULL,
 database_bytes_at_retirement bigint NOT NULL
);
ALTER TABLE private.free_tier_feed_retention_runs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON private.free_tier_feed_retention_runs FROM PUBLIC,anon,authenticated;

CREATE OR REPLACE FUNCTION public.retire_verified_expired_free_tier_feed(
 p_manifest_name text,p_expected_feed_rows integer,p_expected_batches integer
)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=''
AS $fn$
DECLARE v_claim_count integer;v_archived_count integer;v_batch_count integer;
 v_exact_count integer;v_guarded_count integer;v_child_count integer;
 v_matched_count integer;v_deleted_count integer;
BEGIN
 IF NOT pg_catalog.pg_try_advisory_xact_lock(61012026,21) THEN
   RAISE EXCEPTION 'Cold maintenance is already running';
 END IF;
 IF p_manifest_name IS NULL OR
    p_manifest_name !~ '^postgres-cold/[0-9]{4}-[0-9]{2}-[0-9]{2}/manifest-[0-9a-f]{64}\.json$' THEN
   RAISE EXCEPTION 'Invalid immutable verified Storage manifest';
 END IF;
 IF NOT EXISTS(
   SELECT 1 FROM storage.buckets b JOIN storage.objects o ON o.bucket_id=b.id
   WHERE b.id='shared-postgres-cold-archives' AND b.public IS FALSE
     AND o.name=p_manifest_name AND o.metadata->>'mimetype'='application/json'
 ) THEN RAISE EXCEPTION 'Manifest missing from private Storage'; END IF;
 SELECT count(*) INTO v_claim_count FROM private.free_tier_feed_staging_claims;
 SELECT count(*),coalesce(sum(record_count),0) INTO v_batch_count,v_archived_count
 FROM private.feed_cold_batches WHERE source_table='texas_news_feed';
 IF v_claim_count<1 OR v_claim_count>2000 OR
    v_claim_count<>v_archived_count OR
    v_archived_count<>p_expected_feed_rows OR
    (SELECT count(*) FROM private.feed_cold_batches)<>p_expected_batches THEN
   RAISE EXCEPTION 'Archive/claim/Storage-export manifest count does not match';
 END IF;
 PERFORM 1 FROM public.texas_news_feed f
 JOIN private.free_tier_feed_staging_claims c ON c.feed_id=f.id FOR UPDATE OF f;
 WITH originals AS MATERIALIZED (
   SELECT (e.value->>'id')::bigint feed_id,e.value payload
   FROM private.feed_cold_batches b
   CROSS JOIN LATERAL pg_catalog.jsonb_array_elements(b.records) e(value)
   WHERE b.source_table='texas_news_feed'
 ), protected_soft AS MATERIALIZED (
   SELECT DISTINCT v.id_text::bigint id
   FROM public.news_event_facts f
   CROSS JOIN LATERAL pg_catalog.jsonb_array_elements_text(f.source_feed_item_ids) v(id_text)
   WHERE v.id_text ~ '^[0-9]+$'
   UNION SELECT pg_catalog.unnest(feed_item_ids)::bigint
   FROM public.news_event_reconciliation_holds
 )
 SELECT count(*) FILTER (WHERE f.id IS NOT NULL AND pg_catalog.to_jsonb(f)=a.payload),
        count(*) FILTER (WHERE f.id IS NOT NULL AND f.created_at<now()-interval '21 days'
     AND f.pub_date<now()-interval '21 days'
     AND f.internal_slug IS NULL AND f.texasdefined_slug IS NULL
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
     AND NOT EXISTS(SELECT 1 FROM public.news_feed_normalization n
          WHERE n.duplicate_of_feed_item_id=f.id AND n.feed_item_id<>f.id))
 INTO v_exact_count,v_guarded_count
 FROM originals a LEFT JOIN public.texas_news_feed f ON f.id=a.feed_id;
 IF v_exact_count<>v_claim_count OR v_guarded_count<>v_claim_count THEN
   RAISE EXCEPTION 'Feed changed or gained protected references since archive staging';
 END IF;
 SELECT count(*) INTO v_child_count FROM public.news_feed_normalization n
 WHERE n.feed_item_id IN(SELECT feed_id FROM private.free_tier_feed_staging_claims);
 SELECT count(*) INTO v_matched_count
 FROM private.feed_cold_batches b
 CROSS JOIN LATERAL pg_catalog.jsonb_array_elements(b.records) e(value)
 JOIN public.news_feed_normalization n ON n.feed_item_id=(e.value->>'feed_item_id')::bigint
 WHERE b.source_table='news_feed_normalization' AND pg_catalog.to_jsonb(n)=e.value;
 IF v_child_count<>v_matched_count OR
    v_matched_count<>(SELECT coalesce(sum(record_count),0)
      FROM private.feed_cold_batches WHERE source_table='news_feed_normalization') THEN
   RAISE EXCEPTION 'Normalization child changed after archival';
 END IF;
 SELECT count(*) INTO v_child_count FROM public.newsroom_source_page_fetch_state s
 WHERE s.feed_item_id IN(SELECT feed_id FROM private.free_tier_feed_staging_claims);
 SELECT count(*) INTO v_matched_count
 FROM private.feed_cold_batches b
 CROSS JOIN LATERAL pg_catalog.jsonb_array_elements(b.records) e(value)
 JOIN public.newsroom_source_page_fetch_state s
    ON s.feed_item_id=(e.value->>'feed_item_id')::bigint
 WHERE b.source_table='newsroom_source_page_fetch_state' AND pg_catalog.to_jsonb(s)=e.value;
 IF v_child_count<>v_matched_count OR
    v_matched_count<>(SELECT coalesce(sum(record_count),0)
      FROM private.feed_cold_batches WHERE source_table='newsroom_source_page_fetch_state') THEN
   RAISE EXCEPTION 'Fetch-state child changed after archival';
 END IF;
 DELETE FROM public.texas_news_feed f USING private.free_tier_feed_staging_claims c
 WHERE f.id=c.feed_id;
 GET DIAGNOSTICS v_deleted_count=ROW_COUNT;
 IF v_deleted_count<>v_claim_count THEN RAISE EXCEPTION 'Feed retirement count mismatch'; END IF;
 INSERT INTO private.free_tier_feed_retention_runs
 (manifest_name,archived_feed_rows,retired_feed_rows,database_bytes_at_retirement)
 VALUES (p_manifest_name,v_claim_count,v_deleted_count,
         pg_catalog.pg_database_size(pg_catalog.current_database()));
 TRUNCATE TABLE private.feed_cold_batches,private.free_tier_feed_staging_claims;
 RETURN jsonb_build_object('retired_feed',v_deleted_count,'storage_manifest',p_manifest_name);
END
$fn$;
REVOKE ALL ON FUNCTION public.retire_verified_expired_free_tier_feed(text,integer,integer) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.retire_verified_expired_free_tier_feed(text,integer,integer) TO service_role;
