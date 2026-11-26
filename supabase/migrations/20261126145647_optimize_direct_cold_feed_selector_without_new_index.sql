-- Preserve exact eligible-ID semantics while reducing wide feed-table IO.
CREATE OR REPLACE FUNCTION private.direct_cold_ids(p_kind text, p_limit integer, p_ids text[] DEFAULT NULL)
RETURNS text[] LANGUAGE plpgsql STABLE SET search_path TO '' AS $fn$
DECLARE v_ids text[];
BEGIN
 IF p_kind = 'feed' THEN
  IF p_limit NOT BETWEEN 1 AND 50 OR p_limit IS NULL THEN RAISE EXCEPTION 'Invalid direct feed limit'; END IF;
  -- Narrow index-only shard scan and exact primary-key row lookup before
  -- evaluating every unchanged publication and soft-reference safeguard.
  WITH shard_ids AS MATERIALIZED (
   SELECT id FROM public.texas_news_feed
   WHERE p_ids IS NULL AND id % 32 = pg_catalog.floor(pg_catalog.date_part('epoch',now())/7200)::bigint % 32
   UNION ALL SELECT unnest(p_ids::bigint[]) WHERE p_ids IS NOT NULL
  ), candidates AS MATERIALIZED (
   SELECT f.id,f.created_at,f.link FROM shard_ids s
   CROSS JOIN LATERAL (SELECT t.id,t.created_at,t.link FROM public.texas_news_feed t
      WHERE t.id=s.id AND t.created_at<now()-interval '21 days' AND t.pub_date<now()-interval '21 days'
      AND t.internal_slug IS NULL AND t.texasdefined_slug IS NULL LIMIT 1) f
  ), protected_soft AS MATERIALIZED (
   SELECT DISTINCT v.id_text::bigint id FROM public.news_event_facts f
    CROSS JOIN LATERAL pg_catalog.jsonb_array_elements_text(f.source_feed_item_ids) v(id_text)
    WHERE v.id_text ~ '^[0-9]+$'
   UNION SELECT pg_catalog.unnest(feed_item_ids)::bigint FROM public.news_event_reconciliation_holds
  )
  SELECT coalesce(array_agg(s.id::text ORDER BY s.id), ARRAY[]::text[]) INTO v_ids FROM (
   SELECT f.id FROM candidates f
   WHERE TRUE
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
REVOKE ALL ON FUNCTION private.direct_cold_ids(text,integer,text[]) FROM PUBLIC,anon,authenticated,service_role;
