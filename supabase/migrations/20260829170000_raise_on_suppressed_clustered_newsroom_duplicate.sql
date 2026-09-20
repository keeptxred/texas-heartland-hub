-- `prevent_duplicate_daily_article_source_url()` historically returns NULL to
-- silently suppress duplicate source URLs. That legacy behavior is retained for
-- existing writers, but it is unsafe for the clustered newsroom publisher:
-- Supabase returns an empty selected row set, which can be mistaken for a
-- successful publication. Raise explicitly for clustered newsroom articles so
-- generate-newsroom's existing catch path leaves the candidate held.

create or replace function public.prevent_duplicate_daily_article_source_url()
returns trigger
language plpgsql
set search_path = public
as $function$
begin
  if new.source_url is not null
     and btrim(new.source_url) <> ''
     and exists (
       select 1
       from public.daily_articles existing
       where existing.source_url = new.source_url
         and existing.slug <> new.slug
     ) then
    if new.kind = 'news' and new.author = 'Keep TX Red Newsroom' then
      raise exception using
        errcode = '23505',
        message = 'clustered_newsroom_duplicate_source_url',
        detail = format('Source URL %s already belongs to another published article.', new.source_url),
        hint = 'Treat this cluster as already covered or select a substantively different source packet.';
    end if;
    return null;
  end if;

  return new;
end;
$function$;

-- Repair the one false-positive publication state observed before this guard.
-- No article row exists for this candidate/cluster/draft, so reverting them to
-- held/ready restores the actual state without deleting or mutating a public URL.
update public.news_publish_candidates
set status = 'HELD', published_at = null
where id = 'a041b248-342f-4c5e-9a57-5bade95020d7'
  and status = 'PUBLISHED'
  and not exists (
    select 1 from public.daily_articles
    where slug = '2026-08-29-dallas-cowboys-fall-to-new-orleans-saints-27-24-in-preseason-week-3'
  );

update public.news_story_clusters
set status = 'READY', published_at = null, published_article_id = null
where id = 'a1b6f583-9d1a-42eb-bc77-e6adc392ee91'
  and status = 'PUBLISHED'
  and not exists (
    select 1 from public.daily_articles
    where slug = '2026-08-29-dallas-cowboys-fall-to-new-orleans-saints-27-24-in-preseason-week-3'
  );

update public.newsroom_generation_drafts
set status = 'GENERATED', published_article_id = null
where id = '91de5267-e40f-4894-bd21-0aa10b6bbddd'
  and status = 'PUBLISHED'
  and not exists (
    select 1 from public.daily_articles
    where slug = '2026-08-29-dallas-cowboys-fall-to-new-orleans-saints-27-24-in-preseason-week-3'
  );

comment on function public.prevent_duplicate_daily_article_source_url() is
  'Silently suppresses legacy duplicate-source inserts, but raises for clustered newsroom publications so empty inserts cannot be reported as published.';
