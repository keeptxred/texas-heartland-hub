alter table public.daily_articles add column if not exists updated_at timestamptz;

update public.daily_articles
set updated_at = coalesce(
  case
    when (body_json->>'updated') ~ '^\d{4}-\d{2}-\d{2}(T|$)'
      then (body_json->>'updated')::timestamptz
    else null
  end,
  published_at,
  created_at,
  now()
)
where updated_at is null;

alter table public.daily_articles alter column updated_at set default now();

create or replace function public.set_daily_articles_content_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    if new.updated_at is null then
      new.updated_at := coalesce(new.published_at, new.created_at, now());
    end if;
    return new;
  end if;

  if new.title is distinct from old.title
     or new.dek is distinct from old.dek
     or new.body is distinct from old.body
     or new.body_json is distinct from old.body_json
     or new.category is distinct from old.category
     or new.source_name is distinct from old.source_name
     or new.source_url is distinct from old.source_url
  then
    new.updated_at := now();
  else
    new.updated_at := old.updated_at;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_daily_articles_content_updated_at on public.daily_articles;
create trigger trg_daily_articles_content_updated_at
before insert or update on public.daily_articles
for each row execute function public.set_daily_articles_content_updated_at();

update public.daily_articles
set category = 'Government',
    quality_flags = array(select distinct x from unnest(coalesce(quality_flags,'{}'::text[]) || array['taxonomy_corrected']::text[]) x)
where slug in (
  '2026-08-14-texas-governor-abbott-targets-airports-over-alleged-religious-discrimi-5y6nb3',
  '2026-08-14-texas-airports-face-review-over-religious-facilities-jq9lzk',
  '2026-08-08-houston-anime-threat-governor-office'
);

update public.daily_articles
set category = 'Education',
    quality_flags = array(select distinct x from unnest(coalesce(quality_flags,'{}'::text[]) || array['taxonomy_corrected']::text[]) x)
where slug = '2026-08-08-tamu-fort-worth-campus-milestone';

update public.daily_articles
set quality_flags = array(select distinct x from unnest(coalesce(quality_flags,'{}'::text[]) || array['seo_noindex','canonical_duplicate']::text[]) x)
where slug in (
  '2026-08-07-harris-county-funds-ice-shooting-investigation',
  '2026-08-07-presidio-border-wall-levee-ruling',
  '2026-08-08-daniella-guzman-kprc-return-ticket-review'
);

insert into public.article_slug_redirects (old_slug,new_slug)
values
  ('2026-08-07-harris-county-funds-ice-shooting-investigation','2026-08-09-harris-county-ice-shooting-investigation'),
  ('2026-08-07-presidio-border-wall-levee-ruling','2026-08-09-presidio-border-wall-levee-ruling'),
  ('2026-08-08-daniella-guzman-kprc-return-ticket-review','2026-08-09-daniella-guzman-kprc-return')
on conflict (old_slug) do update set new_slug = excluded.new_slug;
