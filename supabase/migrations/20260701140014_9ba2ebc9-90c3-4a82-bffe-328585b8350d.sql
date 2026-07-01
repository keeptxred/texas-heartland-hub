
REVOKE ALL ON FUNCTION public.increment_variant_metric(text, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_variant_metric(text, text, text) TO service_role;
