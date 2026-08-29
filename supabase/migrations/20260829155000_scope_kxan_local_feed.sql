-- KXAN's generic site feed mixes local Austin reporting with broader/national
-- material. Its dedicated Local RSS is healthy and more precise, so use it for
-- the Austin source without deleting or rewriting existing feed history.

update public.content_sources
set rss_url = 'https://www.kxan.com/news/local/feed/',
    updated_at = now()
where source_name = 'KXAN — Austin'
  and enabled = true;
