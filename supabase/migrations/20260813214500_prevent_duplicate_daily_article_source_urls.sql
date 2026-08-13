-- Prevent future automated publication of the same source event under a new slug.
-- Existing historical duplicates are left intact so their published URLs remain permanent.
create or replace function public.prevent_duplicate_daily_article_source_url()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.source_url is not null
     and btrim(new.source_url) <> ''
     and exists (
       select 1
       from public.daily_articles existing
       where existing.source_url = new.source_url
         and existing.slug <> new.slug
     ) then
    return null;
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_duplicate_daily_article_source_url on public.daily_articles;

create trigger prevent_duplicate_daily_article_source_url
before insert on public.daily_articles
for each row
execute function public.prevent_duplicate_daily_article_source_url();
