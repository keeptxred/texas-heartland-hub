-- Preserve already-published KTR sports canonicals while keeping the
-- current rule that new/unpublished routine sports belongs to TexasDefined.

create or replace function public.enforce_texasdefined_sports_ownership()
returns trigger
language plpgsql
set search_path = public
as $function$
declare
  t text := lower(coalesce(new.title, ''));
  is_election_public_affairs boolean;
  is_government_public_affairs boolean;
  is_legal_public_affairs boolean;
  is_public_finance boolean;
begin
  if new.internal_slug is not null or new.texasdefined_slug is not null then return new; end if;

  -- A story already published on KTR remains canonical there unless a published
  -- TexasDefined counterpart exists. This prevents later taxonomy changes from
  -- manufacturing cross-site ownership collisions.
  if new.link is not null
     and exists (select 1 from public.daily_articles a where a.source_url = new.link)
     and not exists (select 1 from public.texasdefined_articles tda where tda.source_url = new.link and tda.status='published')
  then
    new.target_site := 'keeptxred';
    new.target_section := 'Sports';
    return new;
  end if;

  if new.target_site is distinct from 'keeptxred' or new.target_section is distinct from 'Sports' then return new; end if;

  is_election_public_affairs := t ~ '(republican|democrat|gop|political ad|statewide office|railroad commissioner|election|ballot|voter)' and t ~ '(candidate|campaign|republican|democrat|gop|election|ballot|voter|senate|house|governor|lieutenant governor|attorney general|railroad commissioner|statewide office)';
  is_government_public_affairs := t ~ '(lawmakers?|legislature|legislation|house bill|senate bill|state rep|state representative|state senator|governor abbott|gov.? abbott|attorney general|city council|commissioners court|school board)';
  is_legal_public_affairs := t ~ '(lawsuit|sues?|court documents?|court ruling|judge rules?|injunction|restraining order|arrested|charged|indicted|dwi|dui)';
  is_public_finance := t ~ '(stadium|arena|sports venue|athletics)' and t ~ '(public funding|taxpayer|tax incentive|economic development|financ|bond|public money|subsid)';

  if is_election_public_affairs then new.target_site:='keeptxred'; new.target_section:='Elections'; return new;
  elsif is_government_public_affairs then new.target_site:='keeptxred'; new.target_section:='Politics'; return new;
  elsif is_public_finance then new.target_site:='keeptxred'; new.target_section:='Business'; return new;
  elsif is_legal_public_affairs then new.target_site:='keeptxred'; new.target_section:='Texas News'; return new;
  end if;

  new.target_site := 'texasdefined';
  new.target_section := 'Sports';
  new.ready_for_rewrite := false;
  new.viral_signals := (coalesce(new.viral_signals,'{}'::jsonb)-'auto_publish_eligible'-'editorial_lane'-'routing_lock'-'routing_locked_site'-'routing_locked_section')
    || jsonb_build_object('site_ownership','texasdefined','ownership_reason','Routine Texas sports coverage belongs on TexasDefined');
  return new;
end;
$function$;

update public.texas_news_feed f
set target_site='keeptxred', target_section='Sports'
where f.target_site='texasdefined'
and exists(select 1 from public.daily_articles a where a.source_url=f.link)
and not exists(select 1 from public.texasdefined_articles t where t.source_url=f.link and t.status='published');

do $$ begin
 if exists(select 1 from public.cross_site_publication_collisions) then
  raise exception 'cross-site publication ownership collisions remain after reconciliation';
 end if;
end $$;
