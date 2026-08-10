alter table public.texas_news_feed
  add column if not exists cluster_json jsonb;

create index if not exists texas_news_feed_pub_date_cluster_idx
  on public.texas_news_feed (pub_date desc)
  where pub_date is not null;

comment on column public.texas_news_feed.cluster_json is
  'Deterministic multi-source clustering diagnostics: score, source count, source links and clustered timestamp. Clustering itself does not consume AI credits.';
