-- The ingestion Worker deliberately rotates only raw news.google.com source URLs.
-- Our fixed Supabase RSS relay is stable and has already passed full-pool production
-- ingestion with zero transport failures, so keep relay-backed discovery outside
-- that raw-Google rotation class by using a versioned/canonical query ordering.
-- The relay reads searchParams.get('feed'), so this remains fully compatible.

update public.content_sources
set rss_url = regexp_replace(
  rss_url,
  '\?feed=(google-[^&]+)$',
  '?transport=relay&feed=\1'
)
where enabled = true
  and rss_url ~ '^https://ftkznprjljkhymknvhye\.supabase\.co/functions/v1/ktr-rss-relay\?feed=google-';

comment on table public.content_sources is
  'Newsroom discovery source registry. Google-derived discovery is fetched through the fixed Supabase relay; relay URLs use transport=relay so only raw Google URLs are subject to ingestion rotation.';
