-- Preserve the existing canonical site for already-published KTR stories.
-- These rows were reclassified to TexasDefined by later ownership rules, but no
-- TexasDefined counterpart exists. Future/unpublished routine sports still route
-- to TexasDefined; this only reconciles currently published KTR canonicals.

update public.texas_news_feed f
set target_site = 'keeptxred',
    target_section = 'Sports'
where f.target_site = 'texasdefined'
  and exists (
    select 1 from public.daily_articles a
    where a.source_url = f.link
  )
  and not exists (
    select 1 from public.texasdefined_articles t
    where t.source_url = f.link and t.status = 'published'
  );

do $$
begin
  if exists (select 1 from public.cross_site_publication_collisions) then
    raise exception 'cross-site publication ownership collisions remain after reconciliation';
  end if;
end $$;
