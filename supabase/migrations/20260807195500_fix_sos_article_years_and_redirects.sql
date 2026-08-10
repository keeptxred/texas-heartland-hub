-- Repair the 28 Texas Secretary of State articles whose source URL contains the
-- authoritative release year but whose published_at/slug year was parsed as 2001.
-- Preserve every old URL in article_slug_redirects so the application can 301 it.

create table if not exists public.article_slug_redirects (
  old_slug text primary key,
  new_slug text not null unique,
  created_at timestamptz not null default now()
);

with fixes as (
  select id,
         slug as old_slug,
         regexp_replace(
           slug,
           '^live-2001-',
           'live-' || substring(source_url from '/about/newsreleases/(20[0-9]{2})/') || '-'
         ) as new_slug,
         make_timestamptz(
           substring(source_url from '/about/newsreleases/(20[0-9]{2})/')::int,
           extract(month from published_at)::int,
           extract(day from published_at)::int,
           extract(hour from published_at)::int,
           extract(minute from published_at)::int,
           extract(second from published_at),
           'UTC'
         ) as corrected_published_at
  from public.daily_articles
  where slug like 'live-2001-%'
    and source_url ~ '/about/newsreleases/(20[0-9]{2})/'
), saved as (
  insert into public.article_slug_redirects(old_slug, new_slug)
  select old_slug, new_slug from fixes
  on conflict (old_slug) do update set new_slug = excluded.new_slug
  returning old_slug
)
update public.daily_articles d
set slug = f.new_slug,
    published_at = f.corrected_published_at,
    internal_url = '/news/' || f.new_slug
from fixes f
where d.id = f.id;

-- Future guard: Texas SOS release URLs encode the authoritative year in the URL.
-- Normalize published_at and a dated live slug before the row becomes public.
create or replace function public.normalize_sos_release_year()
returns trigger
language plpgsql
as $$
declare
  source_year int;
  slug_year int;
begin
  if new.source_url is null
     or new.source_url !~ '/about/newsreleases/(20[0-9]{2})/' then
    return new;
  end if;

  source_year := substring(new.source_url from '/about/newsreleases/(20[0-9]{2})/')::int;

  if new.published_at is not null and extract(year from new.published_at)::int <> source_year then
    new.published_at := make_timestamptz(
      source_year,
      extract(month from new.published_at)::int,
      extract(day from new.published_at)::int,
      extract(hour from new.published_at)::int,
      extract(minute from new.published_at)::int,
      extract(second from new.published_at),
      'UTC'
    );
  end if;

  if new.slug ~ '^live-[0-9]{4}-[0-9]{2}-[0-9]{2}-' then
    slug_year := substring(new.slug from '^live-([0-9]{4})-')::int;
    if slug_year <> source_year then
      new.slug := regexp_replace(new.slug, '^live-[0-9]{4}-', 'live-' || source_year::text || '-');
      new.internal_url := '/news/' || new.slug;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists normalize_sos_release_year_before_write on public.daily_articles;
create trigger normalize_sos_release_year_before_write
before insert or update of source_url, published_at, slug
on public.daily_articles
for each row execute function public.normalize_sos_release_year();
