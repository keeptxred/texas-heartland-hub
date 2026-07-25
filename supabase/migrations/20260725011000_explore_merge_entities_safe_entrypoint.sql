-- Guarded public entrypoint for the Explore entity merge transaction.
-- Removes direct survivor/duplicate graph edges before the core merge rebuilds the graph.

CREATE OR REPLACE FUNCTION public.explore_merge_duplicate_candidate(
  p_candidate_id uuid,
  p_survivor_entity_id uuid,
  p_merged_entity_id uuid,
  p_resolution_notes text DEFAULT NULL,
  p_resolved_by_user_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
BEGIN
  IF p_survivor_entity_id = p_merged_entity_id THEN
    RAISE EXCEPTION 'Survivor and merged entity must be different.' USING ERRCODE = '22023';
  END IF;

  -- These edges would become self-references after replacement and must not survive a merge.
  DELETE FROM public.explore_entity_relationships
  WHERE (
    source_entity_id = p_survivor_entity_id
    AND target_entity_id = p_merged_entity_id
  ) OR (
    source_entity_id = p_merged_entity_id
    AND target_entity_id = p_survivor_entity_id
  );

  v_result := public.explore_merge_entities(
    p_candidate_id,
    p_survivor_entity_id,
    p_merged_entity_id,
    p_resolution_notes,
    p_resolved_by_user_id
  );

  -- Keep the existing survivor search record coherent until the full index refresh runs.
  UPDATE public.explore_search_index AS search
  SET
    alternate_names = entity.alternate_names,
    popularity_score = entity.popularity_score,
    source_confidence = entity.source_confidence,
    visibility = entity.visibility,
    status = entity.status,
    indexed_at = now(),
    updated_at = now()
  FROM public.explore_entities AS entity
  WHERE search.entity_id = p_survivor_entity_id
    AND entity.id = p_survivor_entity_id;

  RETURN v_result;
END;
$$;

REVOKE ALL ON FUNCTION public.explore_merge_entities(uuid, uuid, uuid, text, uuid) FROM service_role;
REVOKE ALL ON FUNCTION public.explore_merge_duplicate_candidate(uuid, uuid, uuid, text, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.explore_merge_duplicate_candidate(uuid, uuid, uuid, text, uuid) TO service_role;
