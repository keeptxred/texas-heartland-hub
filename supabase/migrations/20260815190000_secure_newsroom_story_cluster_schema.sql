-- Phase 2 security hardening for the internal newsroom cluster tables.
-- These tables are server-only operational state. Service-role access remains
-- available while anonymous/authenticated PostgREST access is denied by RLS.

ALTER TABLE public.news_story_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_story_cluster_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_publish_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generation_budget ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.newsroom_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
