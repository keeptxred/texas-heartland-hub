-- 1) Set immutable search_path on functions that were missing it
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public;
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public;
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public;

-- 2) Lock down SECURITY DEFINER functions so only the service_role can EXECUTE them.
--    All of these are internal backend helpers (email queue + variant metric writer);
--    the app calls them from server routes running under the service role.
REVOKE ALL ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.email_queue_wake() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.email_queue_dispatch() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.increment_variant_metric(text, text, text) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.delete_email(text, bigint) TO service_role;
GRANT EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.email_queue_wake() TO service_role;
GRANT EXECUTE ON FUNCTION public.email_queue_dispatch() TO service_role;
GRANT EXECUTE ON FUNCTION public.increment_variant_metric(text, text, text) TO service_role;

-- 3) Defensively re-assert RLS on PII-bearing tables. These already had service-role-only
--    policies; this makes the "no anon/authenticated read" posture explicit and durable.
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders FORCE ROW LEVEL SECURITY;
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.orders FROM anon, authenticated;

ALTER TABLE public.email_unsubscribe_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_unsubscribe_tokens FORCE ROW LEVEL SECURITY;
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.email_unsubscribe_tokens FROM anon, authenticated;