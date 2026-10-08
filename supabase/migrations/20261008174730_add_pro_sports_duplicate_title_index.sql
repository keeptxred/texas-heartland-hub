create index if not exists texas_news_feed_pro_sports_title_dedupe_idx
on public.texas_news_feed (lower(btrim(title)), id)
where trend_source = 'Texas Pro Sports — Daily Discovery';
