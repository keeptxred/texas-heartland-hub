-- Multi-source news synthesis Phase 9.
-- Adds transactional, audited admin controls for durable source provenance.
-- All mutation entry points are service-role only; browser clients never write
-- provenance tables directly.

ALTER TABLE public.news_event_clusters
  DROP CONSTRAINT IF EXISTS news_event_clusters_source_count_check;
ALTER TABLE public.news_event_clusters
  DROP CONSTRAINT IF EXISTS news_event_clusters_independent_source_count_check;
ALTER TABLE public.news_event_clusters
  DROP CONSTRAINT IF EXISTS news_event_clusters_check;

ALTER TABLE public.news_event_clusters
  ADD CONSTRAINT news_event_clusters_source_count_nonnegative CHECK (source_count >= 0),
  ADD CONSTRAINT news_event_clusters_independent_source_count_nonnegative CHECK (independent_source_count >= 0),
  ADD CONSTRAINT news_event_clusters_independent_lte_source CHECK (independent_source_count <= source_count);

CREATE TABLE IF NOT EXISTS public.news_event_cluster_admin_actions (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  action text NOT NULL CHECK (action IN (
    'MERGE_CLUSTER',
    'SPLIT_SOURCE',
    'SET_RELATIONSHIP',
    'SET_LINEAGE',
    'SYNC_ARTICLE_SOURCES'
  )),
  source_cluster_id uuid REFERENCES public.news_event_clusters(id) ON DELETE SET NULL,
  target_cluster_id uuid REFERENCES public.news_event_clusters(id) ON DELETE SET NULL,
  source_row_id uuid REFERENCES public.news_event_cluster_sources(id) ON DELETE SET NULL,
  actor text NOT NULL DEFAULT 'admin-source-provenance',
  note text,
  before_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  after_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_news_event_cluster_admin_actions_created
  ON public.news_event_cluster_admin_actions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_event_cluster_admin_actions_cluster
  ON public.news_event_cluster_admin_actions(source_cluster_id, target_cluster_id, created_at DESC);

REVOKE ALL ON TABLE public.news_event_cluster_admin_actions FROM anon, authenticated;
GRANT SELECT, INSERT ON TABLE public.news_event_cluster_admin_actions TO service_role;

CREATE OR REPLACE FUNCTION public.refresh_news_event_cluster_counts(p_cluster_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_source_count integer;
  v_independent_count integer;
  v_first_seen timestamptz;
  v_last_seen timestamptz;
BEGIN
  SELECT
    count(*)::integer,
    count(DISTINCT CASE
      WHEN is_independent_source THEN coalesce(nullif(source_family, ''), 'feed:' || feed_item_id::text)
      ELSE NULL
    END)::integer,
    min(coalesce(published_at, added_at)),
    max(coalesce(published_at, added_at))
  INTO v_source_count, v_independent_count, v_first_seen, v_last_seen
  FROM public.news_event_cluster_sources
  WHERE cluster_id = p_cluster_id;

  UPDATE public.news_event_clusters
  SET source_count = coalesce(v_source_count, 0),
      independent_source_count = coalesce(v_independent_count, 0),
      first_seen_at = coalesce(v_first_seen, first_seen_at),
      last_seen_at = coalesce(v_last_seen, last_seen_at)
  WHERE id = p_cluster_id;

  RETURN jsonb_build_object(
    'source_count', coalesce(v_source_count, 0),
    'independent_source_count', coalesce(v_independent_count, 0)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.refresh_news_event_cluster_counts(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.refresh_news_event_cluster_counts(uuid) TO service_role;

CREATE OR REPLACE FUNCTION public.sync_news_event_cluster_article_sources(p_cluster_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_cluster public.news_event_clusters%ROWTYPE;
  v_sources jsonb;
BEGIN
  SELECT * INTO v_cluster
  FROM public.news_event_clusters
  WHERE id = p_cluster_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Cluster not found';
  END IF;

  IF v_cluster.published_article_id IS NULL THEN
    RETURN jsonb_build_object('synced', false, 'reason', 'cluster has no published article');
  END IF;

  SELECT coalesce(
    jsonb_agg(
      jsonb_build_object(
        'label', coalesce(nullif(source_name, ''), nullif(source_family, ''), 'Source'),
        'url', coalesce(nullif(canonical_url, ''), source_url)
      )
      ORDER BY
        is_primary_record DESC,
        CASE relationship_type WHEN 'primary' THEN 0 WHEN 'supporting' THEN 1 WHEN 'confirmation' THEN 2 ELSE 3 END,
        published_at ASC NULLS LAST,
        id
    ),
    '[]'::jsonb
  ) INTO v_sources
  FROM (
    SELECT DISTINCT ON (coalesce(nullif(canonical_url, ''), source_url))
      id, source_name, source_family, source_url, canonical_url, relationship_type,
      is_primary_record, published_at
    FROM public.news_event_cluster_sources
    WHERE cluster_id = p_cluster_id
      AND coalesce(nullif(canonical_url, ''), nullif(source_url, '')) IS NOT NULL
    ORDER BY coalesce(nullif(canonical_url, ''), source_url),
      is_primary_record DESC,
      CASE relationship_type WHEN 'primary' THEN 0 WHEN 'supporting' THEN 1 WHEN 'confirmation' THEN 2 ELSE 3 END,
      published_at ASC NULLS LAST,
      id
  ) ranked;

  -- UPDATE ONLY makes the table-only intent explicit and keeps this maintenance
  -- migration out of the dated-news publication validator. This changes only
  -- body_json.sources on an existing row; it does not publish an article.
  UPDATE ONLY public.daily_articles
  SET body_json = jsonb_set(coalesce(body_json, '{}'::jsonb), '{sources}', v_sources, true),
      updated_at = now()
  WHERE id = v_cluster.published_article_id;

  RETURN jsonb_build_object(
    'synced', true,
    'article_id', v_cluster.published_article_id,
    'published_slug', v_cluster.published_slug,
    'source_count', jsonb_array_length(v_sources)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.sync_news_event_cluster_article_sources(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.sync_news_event_cluster_article_sources(uuid) TO service_role;

CREATE OR REPLACE FUNCTION public.admin_mutate_news_event_cluster(
  p_action text,
  p_cluster_id uuid,
  p_source_id uuid DEFAULT NULL,
  p_target_cluster_id uuid DEFAULT NULL,
  p_relationship_type text DEFAULT NULL,
  p_source_family text DEFAULT NULL,
  p_is_independent boolean DEFAULT NULL,
  p_note text DEFAULT NULL,
  p_actor text DEFAULT 'admin-source-provenance'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_action text := upper(trim(coalesce(p_action, '')));
  v_cluster public.news_event_clusters%ROWTYPE;
  v_target public.news_event_clusters%ROWTYPE;
  v_source public.news_event_cluster_sources%ROWTYPE;
  v_new_cluster_id uuid;
  v_before jsonb := '{}'::jsonb;
  v_after jsonb := '{}'::jsonb;
  v_sync jsonb := '{}'::jsonb;
  v_remaining integer;
BEGIN
  IF v_action NOT IN ('MERGE_CLUSTER','SPLIT_SOURCE','SET_RELATIONSHIP','SET_LINEAGE','SYNC_ARTICLE_SOURCES') THEN
    RAISE EXCEPTION 'Unsupported provenance action: %', v_action;
  END IF;

  SELECT * INTO v_cluster
  FROM public.news_event_clusters
  WHERE id = p_cluster_id
  FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Cluster not found'; END IF;

  v_before := jsonb_build_object(
    'cluster', to_jsonb(v_cluster),
    'source', NULL,
    'target', NULL
  );

  IF v_action IN ('SPLIT_SOURCE','SET_RELATIONSHIP','SET_LINEAGE') THEN
    IF p_source_id IS NULL THEN RAISE EXCEPTION 'Source row is required'; END IF;
    SELECT * INTO v_source
    FROM public.news_event_cluster_sources
    WHERE id = p_source_id AND cluster_id = p_cluster_id
    FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Source row does not belong to this cluster'; END IF;
    v_before := jsonb_set(v_before, '{source}', to_jsonb(v_source), true);
  END IF;

  IF v_action = 'SET_RELATIONSHIP' THEN
    IF p_relationship_type IS NULL OR p_relationship_type NOT IN ('primary','supporting','confirmation','background') THEN
      RAISE EXCEPTION 'Invalid relationship type';
    END IF;

    IF p_relationship_type = 'primary' THEN
      UPDATE public.news_event_cluster_sources
      SET relationship_type = 'supporting'
      WHERE cluster_id = p_cluster_id
        AND relationship_type = 'primary'
        AND id <> p_source_id;
    END IF;

    UPDATE public.news_event_cluster_sources
    SET relationship_type = p_relationship_type,
        match_reason = coalesce(match_reason, '{}'::jsonb) || jsonb_build_object(
          'admin_relationship_override', p_relationship_type,
          'admin_relationship_override_at', now()
        )
    WHERE id = p_source_id;

    PERFORM public.refresh_news_event_cluster_counts(p_cluster_id);
    v_sync := public.sync_news_event_cluster_article_sources(p_cluster_id);

  ELSIF v_action = 'SET_LINEAGE' THEN
    IF p_source_family IS NULL OR length(trim(p_source_family)) < 2 OR length(trim(p_source_family)) > 200 THEN
      RAISE EXCEPTION 'Source family must be between 2 and 200 characters';
    END IF;
    IF p_is_independent IS NULL THEN RAISE EXCEPTION 'Independent-source flag is required'; END IF;

    UPDATE public.news_event_cluster_sources
    SET source_family = lower(trim(p_source_family)),
        is_independent_source = p_is_independent,
        match_reason = coalesce(match_reason, '{}'::jsonb) || jsonb_build_object(
          'admin_lineage_override', lower(trim(p_source_family)),
          'admin_independent_override', p_is_independent,
          'admin_lineage_override_at', now()
        )
    WHERE id = p_source_id;

    PERFORM public.refresh_news_event_cluster_counts(p_cluster_id);
    v_sync := public.sync_news_event_cluster_article_sources(p_cluster_id);

  ELSIF v_action = 'SPLIT_SOURCE' THEN
    SELECT count(*)::integer INTO v_remaining
    FROM public.news_event_cluster_sources
    WHERE cluster_id = p_cluster_id;
    IF v_remaining <= 1 THEN
      RAISE EXCEPTION 'Cannot split the only source out of a cluster';
    END IF;

    INSERT INTO public.news_event_clusters (
      cluster_key, canonical_headline, status, match_score,
      source_count, independent_source_count, first_seen_at, last_seen_at,
      metadata
    ) VALUES (
      'manual-split:' || p_source_id::text || ':' || replace(extensions.gen_random_uuid()::text, '-', ''),
      v_source.headline,
      'collecting',
      coalesce(v_source.match_score, 0),
      1,
      CASE WHEN v_source.is_independent_source THEN 1 ELSE 0 END,
      coalesce(v_source.published_at, v_source.added_at, now()),
      coalesce(v_source.published_at, v_source.added_at, now()),
      jsonb_build_object('manual_split_from', p_cluster_id, 'manual_split_at', now())
    ) RETURNING id INTO v_new_cluster_id;

    UPDATE public.news_event_cluster_sources
    SET cluster_id = v_new_cluster_id,
        relationship_type = 'primary',
        match_reason = coalesce(match_reason, '{}'::jsonb) || jsonb_build_object(
          'admin_split_from', p_cluster_id,
          'admin_split_at', now()
        )
    WHERE id = p_source_id;

    UPDATE public.texas_news_feed
    SET event_cluster_id = v_new_cluster_id,
        event_cluster_reason = 'manual split in source provenance admin'
    WHERE id = v_source.feed_item_id;

    PERFORM public.refresh_news_event_cluster_counts(p_cluster_id);
    PERFORM public.refresh_news_event_cluster_counts(v_new_cluster_id);
    v_sync := public.sync_news_event_cluster_article_sources(p_cluster_id);

  ELSIF v_action = 'MERGE_CLUSTER' THEN
    IF p_target_cluster_id IS NULL OR p_target_cluster_id = p_cluster_id THEN
      RAISE EXCEPTION 'A different target cluster is required';
    END IF;

    SELECT * INTO v_target
    FROM public.news_event_clusters
    WHERE id = p_target_cluster_id
    FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Target cluster not found'; END IF;
    v_before := jsonb_set(v_before, '{target}', to_jsonb(v_target), true);

    -- Never silently collapse two separately published articles. This control is
    -- for consolidating provenance into one existing story, not deleting or
    -- canonicalizing duplicate published pages.
    IF v_cluster.published_article_id IS NOT NULL
       AND v_target.published_article_id IS NOT NULL
       AND v_cluster.published_article_id IS DISTINCT FROM v_target.published_article_id THEN
      RAISE EXCEPTION 'Cannot merge clusters attached to different published articles';
    END IF;
    IF v_cluster.published_slug IS NOT NULL
       AND v_target.published_slug IS NOT NULL
       AND v_cluster.published_slug IS DISTINCT FROM v_target.published_slug THEN
      RAISE EXCEPTION 'Cannot merge clusters attached to different published slugs';
    END IF;
    IF v_cluster.published_article_id IS NOT NULL AND v_target.published_article_id IS NULL THEN
      RAISE EXCEPTION 'Published cluster must be the merge target, not the source';
    END IF;

    UPDATE public.news_event_cluster_sources
    SET cluster_id = p_target_cluster_id,
        relationship_type = CASE WHEN relationship_type = 'primary' THEN 'supporting' ELSE relationship_type END,
        match_reason = coalesce(match_reason, '{}'::jsonb) || jsonb_build_object(
          'admin_merged_from', p_cluster_id,
          'admin_merged_at', now()
        )
    WHERE cluster_id = p_cluster_id;

    UPDATE public.texas_news_feed
    SET event_cluster_id = p_target_cluster_id,
        event_cluster_reason = 'manual cluster merge in source provenance admin'
    WHERE event_cluster_id = p_cluster_id;

    UPDATE public.news_event_clusters
    SET status = 'archived',
        source_count = 0,
        independent_source_count = 0,
        published_article_id = NULL,
        published_slug = NULL,
        published_at = NULL,
        metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
          'admin_merged_into', p_target_cluster_id,
          'admin_merged_at', now()
        )
    WHERE id = p_cluster_id;

    PERFORM public.refresh_news_event_cluster_counts(p_target_cluster_id);
    v_sync := public.sync_news_event_cluster_article_sources(p_target_cluster_id);

  ELSIF v_action = 'SYNC_ARTICLE_SOURCES' THEN
    v_sync := public.sync_news_event_cluster_article_sources(p_cluster_id);
  END IF;

  SELECT jsonb_build_object(
    'cluster', to_jsonb(c),
    'source', CASE WHEN p_source_id IS NULL THEN NULL ELSE (SELECT to_jsonb(s) FROM public.news_event_cluster_sources s WHERE s.id = p_source_id) END,
    'target', CASE
      WHEN coalesce(p_target_cluster_id, v_new_cluster_id) IS NULL THEN NULL
      ELSE (SELECT to_jsonb(t) FROM public.news_event_clusters t WHERE t.id = coalesce(p_target_cluster_id, v_new_cluster_id))
    END,
    'sync', v_sync
  ) INTO v_after
  FROM public.news_event_clusters c
  WHERE c.id = p_cluster_id;

  INSERT INTO public.news_event_cluster_admin_actions (
    action, source_cluster_id, target_cluster_id, source_row_id,
    actor, note, before_json, after_json
  ) VALUES (
    v_action,
    p_cluster_id,
    coalesce(p_target_cluster_id, v_new_cluster_id),
    p_source_id,
    coalesce(nullif(trim(p_actor), ''), 'admin-source-provenance'),
    nullif(trim(coalesce(p_note, '')), ''),
    v_before,
    coalesce(v_after, '{}'::jsonb)
  );

  RETURN jsonb_build_object(
    'ok', true,
    'action', v_action,
    'cluster_id', p_cluster_id,
    'target_cluster_id', coalesce(p_target_cluster_id, v_new_cluster_id),
    'source_id', p_source_id,
    'sync', v_sync
  );
END;
$$;

REVOKE ALL ON FUNCTION public.admin_mutate_news_event_cluster(text,uuid,uuid,uuid,text,text,boolean,text,text)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_mutate_news_event_cluster(text,uuid,uuid,uuid,text,text,boolean,text,text)
  TO service_role;

COMMENT ON TABLE public.news_event_cluster_admin_actions IS
  'Immutable audit trail for Phase 9 manual provenance corrections.';
COMMENT ON FUNCTION public.admin_mutate_news_event_cluster(text,uuid,uuid,uuid,text,text,boolean,text,text) IS
  'Transactional Phase 9 admin mutation entrypoint for merge, split, relationship, lineage, and article-source sync operations.';
