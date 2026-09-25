-- Keep the full 72-hour KTR corroboration scan index-backed as feed volume grows.
-- The application filters to KTR/unrouted rows, orders newest-first by pub_date
-- and id, and then pages through the complete window.
create index if not exists texas_news_feed_ktr_recent_cluster_idx
  on public.texas_news_feed (pub_date desc, id desc)
  where target_site is null or target_site = 'keeptxred';
