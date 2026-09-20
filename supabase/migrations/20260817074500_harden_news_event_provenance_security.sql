-- Production hardening for the durable multi-source event schema.
-- The server-side newsroom and admin provenance paths use service_role; these
-- internal ledgers are not intended to be directly exposed through PostgREST.

ALTER TABLE public.news_event_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_event_cluster_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_event_facts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_event_article_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_event_cluster_admin_actions ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.news_event_clusters FROM anon, authenticated;
REVOKE ALL ON TABLE public.news_event_cluster_sources FROM anon, authenticated;
REVOKE ALL ON TABLE public.news_event_facts FROM anon, authenticated;
REVOKE ALL ON TABLE public.news_event_article_updates FROM anon, authenticated;
REVOKE ALL ON TABLE public.news_event_cluster_admin_actions FROM anon, authenticated;
REVOKE ALL ON TABLE public.news_event_reconciliation_holds FROM anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.news_event_clusters TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.news_event_cluster_sources TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.news_event_facts TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.news_event_article_updates TO service_role;
GRANT SELECT, INSERT ON TABLE public.news_event_cluster_admin_actions TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.news_event_reconciliation_holds TO service_role;

REVOKE ALL ON FUNCTION public.claim_news_event_cluster_update(uuid, uuid, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_news_event_cluster_update(uuid, uuid, integer) TO service_role;
REVOKE ALL ON FUNCTION public.claim_news_event_cluster_publication(uuid, text, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_news_event_cluster_publication(uuid, text, integer) TO service_role;
REVOKE ALL ON FUNCTION public.release_news_event_cluster_publication_claim(uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.release_news_event_cluster_publication_claim(uuid, text) TO service_role;

ALTER FUNCTION public.claim_news_event_cluster_publication(uuid, text, integer) SET search_path = public;
ALTER FUNCTION public.release_news_event_cluster_publication_claim(uuid, text) SET search_path = public;
ALTER FUNCTION public.news_event_cluster_set_updated_at() SET search_path = public;
ALTER FUNCTION public.news_event_fact_set_updated_at() SET search_path = public;
ALTER FUNCTION public.news_event_cluster_preserve_published_status() SET search_path = public;
