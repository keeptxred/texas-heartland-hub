do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'bill_article_relationships_article_id_fkey'
      and conrelid = 'public.bill_article_relationships'::regclass
  ) then
    alter table public.bill_article_relationships
      add constraint bill_article_relationships_article_id_fkey
      foreign key (article_id)
      references public.daily_articles(id)
      on delete cascade;
  end if;
end
$$;

comment on constraint bill_article_relationships_article_id_fkey on public.bill_article_relationships is
  'Enables referential integrity and PostgREST embedding from bill article relationships to daily_articles.';
