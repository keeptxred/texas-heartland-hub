-- Protect official TLO subject evidence from the lower-confidence text matcher,
-- and synchronize approved bill/article rows with the authority graph.

create or replace function public.preserve_official_bill_subject_relationship()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if old.source = 'official-tlo-subject-record-v1'
     and new.source = 'verified-subject-matcher-v1' then
    return old;
  end if;
  return new;
end
$$;

drop trigger if exists preserve_official_bill_subject_relationship
  on public.bill_subject_relationships;
create trigger preserve_official_bill_subject_relationship
before update on public.bill_subject_relationships
for each row execute function public.preserve_official_bill_subject_relationship();

create or replace function public.sync_bill_article_authority_relationship()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_bill_id uuid;
  v_article_id uuid;
  v_score integer;
  v_evidence jsonb;
begin
  v_bill_id := coalesce(new.bill_id, old.bill_id);
  v_article_id := coalesce(new.article_id, old.article_id);

  -- Remove only automated graph rows. Manual authority edges always survive.
  if tg_op in ('UPDATE', 'DELETE') then
    delete from public.authority_relationships
    where is_manual = false
      and relationship_type = 'related-news'
      and (
        (source_type = 'bill' and source_key = v_bill_id::text
          and target_type = 'article' and target_key = v_article_id::text)
        or
        (source_type = 'article' and source_key = v_article_id::text
          and target_type = 'bill' and target_key = v_bill_id::text)
      );
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;

  -- Pending or rejected candidates remain reviewable but do not enter public authority traversal.
  if new.review_status <> 'approved' then
    return new;
  end if;

  v_score := greatest(10, least(40, round(coalesce(new.confidence, 0.5) * 40)::integer));
  v_evidence := coalesce(new.evidence, '{}'::jsonb) || jsonb_build_object(
    'source', coalesce(new.source, 'bill-article-relationship'),
    'article_relationship_type', new.relationship_type,
    'review_status', new.review_status
  );

  perform public.upsert_bidirectional_authority_relationship(
    'bill',
    new.bill_id::text,
    'article',
    new.article_id::text,
    'related-news',
    v_score,
    v_evidence,
    false
  );

  return new;
end
$$;

drop trigger if exists sync_bill_article_authority_relationship
  on public.bill_article_relationships;
create trigger sync_bill_article_authority_relationship
after insert or update or delete on public.bill_article_relationships
for each row execute function public.sync_bill_article_authority_relationship();

-- Backfill approved relationships that predate the trigger. Manual graph rows win on conflict.
insert into public.authority_relationships
  (source_type, source_key, target_type, target_key, relationship_type, score, evidence, is_manual)
select
  edge.source_type,
  edge.source_key,
  edge.target_type,
  edge.target_key,
  'related-news',
  edge.score,
  edge.evidence,
  false
from (
  select
    'bill'::text as source_type,
    relationship.bill_id::text as source_key,
    'article'::text as target_type,
    relationship.article_id::text as target_key,
    greatest(10, least(40, round(coalesce(relationship.confidence, 0.5) * 40)::integer)) as score,
    coalesce(relationship.evidence, '{}'::jsonb) || jsonb_build_object(
      'source', coalesce(relationship.source, 'bill-article-relationship'),
      'article_relationship_type', relationship.relationship_type,
      'review_status', relationship.review_status
    ) as evidence
  from public.bill_article_relationships relationship
  where relationship.review_status = 'approved'

  union all

  select
    'article'::text as source_type,
    relationship.article_id::text as source_key,
    'bill'::text as target_type,
    relationship.bill_id::text as target_key,
    greatest(10, least(40, round(coalesce(relationship.confidence, 0.5) * 40)::integer)) as score,
    coalesce(relationship.evidence, '{}'::jsonb) || jsonb_build_object(
      'source', coalesce(relationship.source, 'bill-article-relationship'),
      'article_relationship_type', relationship.relationship_type,
      'review_status', relationship.review_status
    ) as evidence
  from public.bill_article_relationships relationship
  where relationship.review_status = 'approved'
) edge
on conflict (source_type, source_key, target_type, target_key, relationship_type)
do update set
  score = case
    when public.authority_relationships.is_manual then public.authority_relationships.score
    else excluded.score
  end,
  evidence = case
    when public.authority_relationships.is_manual then public.authority_relationships.evidence
    else excluded.evidence
  end,
  updated_at = now();
