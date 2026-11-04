-- Additive, public-read-only bill search. No bill tables or sync workflows are changed.
-- SECURITY INVOKER preserves all existing row-level-security policies.
CREATE OR REPLACE FUNCTION public.ktr_bill_search_page(
  p_query text DEFAULT '',
  p_sponsor text DEFAULT '',
  p_status_codes text[] DEFAULT NULL,
  p_legislature integer DEFAULT NULL,
  p_session text DEFAULT '',
  p_chamber text DEFAULT '',
  p_bill_type text DEFAULT '',
  p_kind text DEFAULT 'all',
  p_sort text DEFAULT 'latest',
  p_limit integer DEFAULT 24,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (bill jsonb, total_count bigint)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public
AS $function$
  SELECT to_jsonb(b), count(*) OVER ()
  FROM public.bills AS b
  WHERE b.is_active = true
    AND (
      nullif(trim(p_query), '') IS NULL
      OR b.bill_identifier ILIKE '%' || trim(p_query) || '%'
      OR b.caption ILIKE '%' || trim(p_query) || '%'
      OR b.description ILIKE '%' || trim(p_query) || '%'
      OR EXISTS (
        SELECT 1
        FROM public.bill_subject_relationships AS r
        JOIN public.bill_subjects AS subj ON subj.id = r.subject_id
        WHERE r.bill_id = b.id
          AND r.review_status = 'approved'
          AND (subj.name ILIKE '%' || trim(p_query) || '%' OR subj.description ILIKE '%' || trim(p_query) || '%')
      )
    )
    AND (
      nullif(trim(p_sponsor), '') IS NULL
      OR EXISTS (
        SELECT 1 FROM public.bill_sponsors AS s
        WHERE s.bill_id = b.id
          AND s.sponsor_name ILIKE '%' || trim(p_sponsor) || '%'
      )
    )
    AND (p_legislature IS NULL OR b.legislature_number = p_legislature)
    AND (nullif(trim(p_session), '') IS NULL OR b.session_code = upper(trim(p_session)))
    AND (nullif(trim(p_chamber), '') IS NULL OR b.chamber = lower(trim(p_chamber)))
    AND (nullif(trim(p_bill_type), '') IS NULL OR b.bill_type = lower(trim(p_bill_type)))
    AND (coalesce(cardinality(p_status_codes), 0) = 0 OR b.current_status_code = ANY (p_status_codes))
    AND (
      p_kind = 'all'
      OR (p_kind = 'substantive' AND (
        b.bill_type = ANY (ARRAY['hb', 'sb']) OR
        trim(p_query) ~* '^(hcr|scr|hjr|sjr|hr|sr)[[:space:]]*[0-9]+'
      ))
      OR (p_kind = 'resolutions' AND b.bill_type = ANY (ARRAY['hcr', 'scr', 'hr', 'sr', 'hjr', 'sjr']))
    )
  ORDER BY
    CASE WHEN p_sort = 'oldest' THEN b.last_action_date END ASC NULLS LAST,
    CASE WHEN p_sort = 'bill-number' THEN b.bill_number END ASC NULLS LAST,
    CASE WHEN p_sort NOT IN ('oldest', 'bill-number') THEN b.last_action_date END DESC NULLS LAST,
    b.id ASC
  LIMIT LEAST(GREATEST(p_limit, 1), 100)
  OFFSET GREATEST(p_offset, 0);
$function$;

REVOKE ALL ON FUNCTION public.ktr_bill_search_page(
  text, text, text[], integer, text, text, text, text, text, integer, integer
) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ktr_bill_search_page(
  text, text, text[], integer, text, text, text, text, text, integer, integer
) TO anon, authenticated;
