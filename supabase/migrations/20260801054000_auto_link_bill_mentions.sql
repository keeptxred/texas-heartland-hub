-- Link explicit Texas bill identifiers in published stories without an AI call.
-- The newest matching imported session wins when an article omits the session.

create or replace function public.link_article_bill_mentions()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  mention record;
  matched_bill public.bills%rowtype;
  searchable_text text;
begin
  searchable_text := concat_ws(' ', new.title, new.dek, new.body, new.body_json::text);

  delete from public.bill_article_relationships
  where article_id = new.id and is_manual = false and relationship_type = 'explicit-mention';

  delete from public.authority_relationships
  where is_manual = false
    and relationship_type = 'related-news'
    and evidence->>'source' = 'explicit-bill-mention'
    and ((source_type = 'article' and source_key = new.id::text)
      or (target_type = 'article' and target_key = new.id::text));

  for mention in
    select distinct upper(matches[1]) as bill_type, matches[2]::integer as bill_number
    from regexp_matches(
      searchable_text,
      '\m(HB|SB|HJR|SJR|HCR|SCR|HR|SR)[[:space:]-]*([0-9]{1,5})\M',
      'gi'
    ) as matches
  loop
    select * into matched_bill
    from public.bills
    where upper(bill_type) = mention.bill_type
      and bill_number = mention.bill_number
    order by is_active desc, legislature_number desc, session_code desc
    limit 1;

    if matched_bill.id is not null then
      insert into public.bill_article_relationships
        (bill_id, article_id, relationship_type, confidence, is_manual, updated_at)
      values
        (matched_bill.id, new.id, 'explicit-mention', 1.0, false, now())
      on conflict (bill_id, article_id) do update set
        relationship_type = case when bill_article_relationships.is_manual then bill_article_relationships.relationship_type else excluded.relationship_type end,
        confidence = case when bill_article_relationships.is_manual then bill_article_relationships.confidence else excluded.confidence end,
        updated_at = now();

      perform public.upsert_bidirectional_authority_relationship(
        'bill', matched_bill.id::text, 'article', new.id::text,
        'related-news', 40,
        jsonb_build_object('source', 'explicit-bill-mention', 'identifier', matched_bill.bill_identifier)
      );
    end if;
  end loop;

  return new;
end;
$$;

drop trigger if exists trg_link_article_bill_mentions on public.daily_articles;
create trigger trg_link_article_bill_mentions
after insert or update of title, dek, body, body_json on public.daily_articles
for each row execute function public.link_article_bill_mentions();

revoke all on function public.link_article_bill_mentions() from public;

-- Backfill relationships without rewriting or re-saving article content.
insert into public.bill_article_relationships
  (bill_id, article_id, relationship_type, confidence, is_manual)
select distinct matched_bill.id, article.id, 'explicit-mention', 1.0, false
from public.daily_articles article
cross join lateral regexp_matches(
  concat_ws(' ', article.title, article.dek, article.body, article.body_json::text),
  '\m(HB|SB|HJR|SJR|HCR|SCR|HR|SR)[[:space:]-]*([0-9]{1,5})\M',
  'gi'
) as mention
join lateral (
  select bill.id
  from public.bills bill
  where upper(bill.bill_type) = upper(mention[1])
    and bill.bill_number = mention[2]::integer
  order by bill.is_active desc, bill.legislature_number desc, bill.session_code desc
  limit 1
) matched_bill on true
on conflict (bill_id, article_id) do nothing;

select public.refresh_legislative_authority_graph();
