-- Keep canonical bill-subject rows synchronized with the authority graph.

create or replace function public.sync_bill_subject_authority_relationship()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_bill_id uuid;
  v_subject_id uuid;
  v_subject_slug text;
begin
  v_bill_id := coalesce(new.bill_id, old.bill_id);
  v_subject_id := coalesce(new.subject_id, old.subject_id);

  select slug into v_subject_slug
  from public.bill_subjects
  where id = v_subject_id;

  if tg_op = 'DELETE' then
    delete from public.authority_relationships
    where is_manual = false
      and relationship_type = 'bill-subject'
      and (
        (source_type = 'bill' and source_key = v_bill_id::text and target_type = 'subject' and target_key = v_subject_slug)
        or
        (source_type = 'subject' and source_key = v_subject_slug and target_type = 'bill' and target_key = v_bill_id::text)
      );
    return old;
  end if;

  if v_subject_slug is not null then
    perform public.upsert_bidirectional_authority_relationship(
      'bill',
      v_bill_id::text,
      'subject',
      v_subject_slug,
      'bill-subject',
      34,
      jsonb_build_object('source', 'official-bill-subject-record')
    );
  end if;

  return new;
end
$$;

drop trigger if exists sync_bill_subject_authority_relationship on public.bill_subject_relationships;
create trigger sync_bill_subject_authority_relationship
after insert or update or delete on public.bill_subject_relationships
for each row execute function public.sync_bill_subject_authority_relationship();

-- Backfill any relationships that existed before the trigger was installed.
insert into public.authority_relationships
  (source_type, source_key, target_type, target_key, relationship_type, score, evidence)
select
  edge.source_type,
  edge.source_key,
  edge.target_type,
  edge.target_key,
  'bill-subject',
  34,
  jsonb_build_object('source', 'official-bill-subject-record')
from (
  select
    'bill'::text source_type,
    relationship.bill_id::text source_key,
    'subject'::text target_type,
    subject.slug target_key
  from public.bill_subject_relationships relationship
  join public.bill_subjects subject on subject.id = relationship.subject_id

  union all

  select
    'subject'::text source_type,
    subject.slug source_key,
    'bill'::text target_type,
    relationship.bill_id::text target_key
  from public.bill_subject_relationships relationship
  join public.bill_subjects subject on subject.id = relationship.subject_id
) edge
on conflict (source_type, source_key, target_type, target_key, relationship_type)
do update set
  score = case
    when authority_relationships.is_manual then authority_relationships.score
    else excluded.score
  end,
  evidence = case
    when authority_relationships.is_manual then authority_relationships.evidence
    else excluded.evidence
  end,
  updated_at = now();
