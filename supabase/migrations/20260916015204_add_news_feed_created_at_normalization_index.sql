-- The 15-minute newsroom normalizer reads the newest 1,000 feed rows by
-- created_at. Production EXPLAIN before this index used a seq scan + top-N sort
-- and took ~4.3s; after this index the same query is an index scan at ~52ms.
create index if not exists texas_news_feed_created_at_normalization_idx
  on public.texas_news_feed (created_at desc, id desc);
