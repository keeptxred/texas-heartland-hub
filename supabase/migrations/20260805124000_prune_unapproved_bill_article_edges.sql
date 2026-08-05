-- Prevent legacy authority refreshes from leaving pending or rejected
-- bill/article matches in public graph traversal.

create or replace function public.prune_unapproved_bill_article_authority_edges(
  p_bill_id uuid default null
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_deleted integer := 0;
begin
  with removed as (
    delete from public.authority_relationships ar
    where ar.is_manual = false
      and ar.relationship_type = 'related-news'
      and (
        (
          ar.source_type = 'bill'
          and ar.target_type = 'article'
          and (p_bill_id is null or ar.source_key = p_bill_id::text)
          and not exists (
            select 1
            from public.bill_article_relationships relationship
            where relationship.bill_id::text = ar.source_key
              and relationship.article_id::text = ar.target_key
              and relationship.review_status = 'approved'
          )
        )
        or
        (
          ar.source_type = 'article'
          and ar.target_type = 'bill'
          and (p_bill_id is null or ar.target_key = p_bill_id::text)
          and not exists (
            select 1
            from public.bill_article_relationships relationship
            where relationship.article_id::text = ar.source_key
              and relationship.bill_id::text = ar.target_key
              and relationship.review_status = 'approved'
          )
        )
      )
    returning 1
  )
  select count(*) into v_deleted from removed;

  return v_deleted;
end
$$;

revoke all on function public.prune_unapproved_bill_article_authority_edges(uuid) from public;
grant execute on function public.prune_unapproved_bill_article_authority_edges(uuid) to service_role;

-- Clean up any stale graph rows immediately when this migration is applied.
select public.prune_unapproved_bill_article_authority_edges(null);

comment on function public.prune_unapproved_bill_article_authority_edges(uuid) is
  'Removes automated related-news authority edges unless the canonical bill/article relationship is approved.';
