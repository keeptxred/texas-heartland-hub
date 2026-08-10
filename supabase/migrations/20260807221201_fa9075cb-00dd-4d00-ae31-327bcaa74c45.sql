ALTER TABLE public.article_slug_redirects ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.article_slug_redirects FROM anon, authenticated;
GRANT SELECT ON public.article_slug_redirects TO anon, authenticated;
GRANT ALL ON public.article_slug_redirects TO service_role;

DROP POLICY IF EXISTS "Article redirects are publicly readable" ON public.article_slug_redirects;
CREATE POLICY "Article redirects are publicly readable"
ON public.article_slug_redirects
FOR SELECT
TO anon, authenticated
USING (true);