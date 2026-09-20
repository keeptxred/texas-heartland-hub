-- Canonicalize Google relay URLs so ingest-feeds recognizes them as the
-- rotating Google News discovery layer. The relay ignores query parameter
-- order, but ingest-feeds intentionally distinguishes Google sources from
-- direct publishers by the `?feed=google-` prefix.
--
-- This is idempotent and changes transport URL spelling only; source identity,
-- category, enablement, routing, scoring, and publication safeguards are
-- unchanged.

update public.content_sources
set rss_url = regexp_replace(
  rss_url,
  '\?transport=relay&feed=(google-[^&]+)',
  '?feed=\1&transport=relay'
)
where enabled = true
  and rss_url like 'https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay?transport=relay&feed=google-%';
