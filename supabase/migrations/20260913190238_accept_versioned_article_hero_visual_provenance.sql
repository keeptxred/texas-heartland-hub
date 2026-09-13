CREATE OR REPLACE FUNCTION public.article_hero_has_visual_readiness_provenance(note text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
SET search_path = pg_catalog, public
AS $$
  SELECT coalesce(note, '') ~* 'cloudflare-vision(-v[0-9]+)?[[:space:]]+ok:'
      OR coalesce(note, '') ILIKE 'authoritative-image-exempt:%';
$$;

COMMENT ON FUNCTION public.article_hero_has_visual_readiness_provenance(text) IS
  'True for article heroes that passed Cloudflare visual validation, including versioned stored-photo policies, or use an explicit authoritative official-graphic exemption. Shared heroes must retain a Cloudflare validation marker.';
