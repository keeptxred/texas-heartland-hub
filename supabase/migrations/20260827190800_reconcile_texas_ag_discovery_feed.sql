-- Reconcile the Texas Attorney General discovery RSS URL after the production
-- activation of the already-merged discovery source set. This is idempotent
-- and preserves the source's enabled state and all existing ingestion gates.

UPDATE public.content_sources
SET rss_url = 'https://news.google.com/rss/search?q=%28site%3Atexasattorneygeneral.gov+OR+%22Texas+Attorney+General%22+settlement+OR+%22Texas+Attorney+General%22+lawsuit+OR+%22Texas+Attorney+General%22+investigation%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen'
WHERE source_name = 'Texas Attorney General Actions — Google News';
