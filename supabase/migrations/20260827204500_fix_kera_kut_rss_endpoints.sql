-- Replace two NPR-station RSS endpoints that return HTTP 200 but no feed items
-- with verified current official feeds. Preserve source names/categories so
-- existing newsroom attribution and routing remain stable.

update public.content_sources
set rss_url = 'https://www.kut.org/feeds/3367/rss.xml',
    updated_at = now()
where source_name = 'KUT 90.5 — Austin'
  and rss_url is distinct from 'https://www.kut.org/feeds/3367/rss.xml';

update public.content_sources
set rss_url = 'https://www.keranews.org/news.rss',
    updated_at = now()
where source_name = 'KERA News'
  and rss_url is distinct from 'https://www.keranews.org/news.rss';
