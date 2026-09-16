create or replace function public.list_news_feed_normalizations(p_feed_item_ids bigint[])
returns table(
  feed_item_id bigint,
  normalized_title text,
  normalized_description text,
  canonical_url text,
  source_key text,
  title_fingerprint text,
  content_fingerprint text,
  duplicate_of_feed_item_id bigint,
  duplicate_reason text,
  dedupe_confidence numeric,
  observed_at timestamptz,
  normalization_version integer
)
language sql
stable
security invoker
set search_path = pg_catalog, public
as $$
  select
    n.feed_item_id,
    n.normalized_title,
    n.normalized_description,
    n.canonical_url,
    n.source_key,
    n.title_fingerprint,
    n.content_fingerprint,
    n.duplicate_of_feed_item_id,
    n.duplicate_reason,
    n.dedupe_confidence,
    n.observed_at,
    n.normalization_version
  from public.news_feed_normalization n
  where n.feed_item_id = any(coalesce(p_feed_item_ids, array[]::bigint[]));
$$;

revoke all on function public.list_news_feed_normalizations(bigint[]) from public, anon, authenticated;
grant execute on function public.list_news_feed_normalizations(bigint[]) to service_role;
