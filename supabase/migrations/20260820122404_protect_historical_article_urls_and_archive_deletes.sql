-- Preserve a durable registry of every dynamic article URL and every URL with stored GSC visibility.
create table if not exists public.article_url_registry (
  slug text primary key,
  canonical_path text not null,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  origin text not null default 'daily_articles',
  had_search_visibility boolean not null default false,
  gsc_clicks integer not null default 0,
  gsc_impressions integer not null default 0,
  redirect_target text,
  notes text
);

alter table public.article_url_registry enable row level security;
revoke all on public.article_url_registry from anon, authenticated;
grant all on public.article_url_registry to service_role;

comment on table public.article_url_registry is
  'Durable registry of published KeepTXRed article slugs and historical GSC-visible /news URLs. Used to prevent silent URL loss.';

insert into public.article_url_registry (
  slug, canonical_path, first_seen_at, last_seen_at, origin, had_search_visibility,
  gsc_clicks, gsc_impressions, redirect_target
)
select d.slug,
       '/news/' || d.slug,
       coalesce(d.created_at, d.published_at, now()),
       now(),
       'daily_articles',
       coalesce(d.gsc_impressions,0) > 0 or coalesce(d.gsc_clicks,0) > 0,
       coalesce(d.gsc_clicks,0),
       coalesce(d.gsc_impressions,0),
       r.new_slug
from public.daily_articles d
left join public.article_slug_redirects r on r.old_slug = d.slug
on conflict (slug) do update set
  last_seen_at = excluded.last_seen_at,
  had_search_visibility = public.article_url_registry.had_search_visibility or excluded.had_search_visibility,
  gsc_clicks = greatest(public.article_url_registry.gsc_clicks, excluded.gsc_clicks),
  gsc_impressions = greatest(public.article_url_registry.gsc_impressions, excluded.gsc_impressions),
  redirect_target = coalesce(excluded.redirect_target, public.article_url_registry.redirect_target);

insert into public.article_url_registry (
  slug, canonical_path, first_seen_at, last_seen_at, origin, had_search_visibility,
  gsc_clicks, gsc_impressions, redirect_target, notes
)
select m.slug,
       '/news/' || m.slug,
       coalesce(m.window_start::timestamptz, now()),
       coalesce(m.window_end::timestamptz, now()),
       'gsc',
       (coalesce(m.gsc_impressions,0) > 0 or coalesce(m.gsc_clicks,0) > 0),
       coalesce(m.gsc_clicks,0),
       coalesce(m.gsc_impressions,0),
       r.new_slug,
       'Backfilled from article_search_metrics'
from public.article_search_metrics m
left join public.article_slug_redirects r on r.old_slug = m.slug
on conflict (slug) do update set
  last_seen_at = greatest(public.article_url_registry.last_seen_at, excluded.last_seen_at),
  had_search_visibility = public.article_url_registry.had_search_visibility or excluded.had_search_visibility,
  gsc_clicks = greatest(public.article_url_registry.gsc_clicks, excluded.gsc_clicks),
  gsc_impressions = greatest(public.article_url_registry.gsc_impressions, excluded.gsc_impressions),
  redirect_target = coalesce(excluded.redirect_target, public.article_url_registry.redirect_target),
  notes = coalesce(public.article_url_registry.notes, excluded.notes);

-- The Monarch URL had one known GSC impression before the later metric-ledger window.
insert into public.article_url_registry (
  slug, canonical_path, origin, had_search_visibility, gsc_impressions, notes
) values (
  'live-2026-07-01-san-antonio-luxury-lodging-expands-with-the-monarch-opening-w4mj12',
  '/news/live-2026-07-01-san-antonio-luxury-lodging-expands-with-the-monarch-opening-w4mj12',
  'gsc_manual_recovery', true, 1,
  'GSC web impression observed 2026-07-14 at average position 32; restored 2026-08-20.'
)
on conflict (slug) do update set
  had_search_visibility = true,
  gsc_impressions = greatest(public.article_url_registry.gsc_impressions,1),
  last_seen_at = now(),
  notes = excluded.notes;

create or replace function public.register_published_article_url()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  insert into public.article_url_registry (
    slug, canonical_path, first_seen_at, last_seen_at, origin,
    had_search_visibility, gsc_clicks, gsc_impressions
  ) values (
    new.slug,
    '/news/' || new.slug,
    coalesce(new.created_at, new.published_at, now()),
    now(),
    'daily_articles',
    coalesce(new.gsc_impressions,0) > 0 or coalesce(new.gsc_clicks,0) > 0,
    coalesce(new.gsc_clicks,0),
    coalesce(new.gsc_impressions,0)
  )
  on conflict (slug) do update set
    last_seen_at = now(),
    canonical_path = excluded.canonical_path,
    had_search_visibility = public.article_url_registry.had_search_visibility or excluded.had_search_visibility,
    gsc_clicks = greatest(public.article_url_registry.gsc_clicks, excluded.gsc_clicks),
    gsc_impressions = greatest(public.article_url_registry.gsc_impressions, excluded.gsc_impressions);
  return new;
end;
$$;

drop trigger if exists trg_register_published_article_url on public.daily_articles;
create trigger trg_register_published_article_url
after insert or update of slug, gsc_clicks, gsc_impressions
on public.daily_articles
for each row execute function public.register_published_article_url();

-- Keep redirect state reflected in the registry too.
create or replace function public.register_article_slug_redirect()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  insert into public.article_url_registry (
    slug, canonical_path, origin, redirect_target, notes
  ) values (
    new.old_slug,
    '/news/' || new.old_slug,
    'redirect',
    new.new_slug,
    'Canonical redirect recorded in article_slug_redirects'
  )
  on conflict (slug) do update set
    last_seen_at = now(),
    redirect_target = excluded.redirect_target,
    notes = excluded.notes;
  return new;
end;
$$;

drop trigger if exists trg_register_article_slug_redirect on public.article_slug_redirects;
create trigger trg_register_article_slug_redirect
after insert or update of new_slug
on public.article_slug_redirects
for each row execute function public.register_article_slug_redirect();

-- Archive the complete row before any intentionally authorized deletion.
create table if not exists public.daily_article_archive (
  archive_id uuid primary key default gen_random_uuid(),
  slug text not null,
  archived_at timestamptz not null default now(),
  removal_reason text,
  redirect_target text,
  row_data jsonb not null
);
create index if not exists daily_article_archive_slug_idx
  on public.daily_article_archive(slug, archived_at desc);
alter table public.daily_article_archive enable row level security;
revoke all on public.daily_article_archive from anon, authenticated;
grant all on public.daily_article_archive to service_role;

comment on table public.daily_article_archive is
  'Server-only full-row archive written before an authorized daily_articles deletion so public URL/content history can be recovered.';

create or replace function public.archive_daily_article_before_delete()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  target text;
begin
  select new_slug into target
  from public.article_slug_redirects
  where old_slug = old.slug;

  insert into public.daily_article_archive(slug, removal_reason, redirect_target, row_data)
  values (
    old.slug,
    nullif(current_setting('app.article_removal_reason', true), ''),
    target,
    to_jsonb(old)
  );
  return old;
end;
$$;

drop trigger if exists trg_archive_daily_article_before_delete on public.daily_articles;
create trigger trg_archive_daily_article_before_delete
before delete on public.daily_articles
for each row execute function public.archive_daily_article_before_delete();

-- Harden the existing immutability guard. Even with the emergency mutation override,
-- a published URL cannot be deleted or renamed without an explicit redirect unless
-- a second, deliberate orphan override is enabled for exceptional legal/safety cases.
create or replace function public.preserve_published_article_url()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  mutation_override boolean := coalesce(current_setting('app.allow_published_article_mutation', true), 'off') = 'on';
  orphan_override boolean := coalesce(current_setting('app.allow_orphan_article_url', true), 'off') = 'on';
  target text;
begin
  if not mutation_override then
    if tg_op = 'DELETE' then
      raise exception
        'Published article % is permanent. Create an explicit redirect before any approved removal; emergency mutation override alone is not sufficient.',
        old.slug;
    end if;

    if new.slug is distinct from old.slug or new.internal_url is distinct from old.internal_url then
      raise exception
        'Published article URLs are immutable (%). Create an explicit redirect before changing a public URL.',
        old.slug;
    end if;
    return new;
  end if;

  if tg_op = 'DELETE' then
    select new_slug into target
    from public.article_slug_redirects
    where old_slug = old.slug;

    if target is null and not orphan_override then
      raise exception
        'Refusing to orphan published URL %. Add article_slug_redirects first, or explicitly enable app.allow_orphan_article_url for an exceptional removal.',
        old.slug;
    end if;
    return old;
  end if;

  if new.slug is distinct from old.slug or new.internal_url is distinct from old.internal_url then
    select new_slug into target
    from public.article_slug_redirects
    where old_slug = old.slug;

    if (target is null or target <> new.slug) and not orphan_override then
      raise exception
        'Refusing to rename published URL % without redirecting it to the new slug %.',
        old.slug, new.slug;
    end if;
  end if;

  return new;
end;
$$;

-- Dynamic live URLs with search history that currently have neither an article nor a redirect.
create or replace view public.orphaned_dynamic_search_urls
with (security_invoker = true)
as
select r.slug,
       r.canonical_path,
       r.gsc_clicks,
       r.gsc_impressions,
       r.last_seen_at
from public.article_url_registry r
left join public.daily_articles d on d.slug = r.slug
left join public.article_slug_redirects s on s.old_slug = r.slug
where r.slug like 'live-%'
  and r.had_search_visibility = true
  and d.slug is null
  and s.old_slug is null;

revoke all on public.orphaned_dynamic_search_urls from anon, authenticated;
grant select on public.orphaned_dynamic_search_urls to service_role;

comment on view public.orphaned_dynamic_search_urls is
  'Recovery queue: previously search-visible dynamic live URLs that currently lack both content and a redirect.';