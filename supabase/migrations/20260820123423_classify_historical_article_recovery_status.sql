alter table public.article_url_registry
  add column if not exists recovery_status text not null default 'pending',
  add column if not exists retired_reason text;

alter table public.article_url_registry
  drop constraint if exists article_url_registry_recovery_status_check;
alter table public.article_url_registry
  add constraint article_url_registry_recovery_status_check
  check (recovery_status in ('pending','restored','redirected','redirect_candidate','retired_low_value'));

update public.article_url_registry r
set recovery_status = 'restored',
    last_seen_at = now()
where exists (select 1 from public.daily_articles d where d.slug = r.slug);

update public.article_url_registry r
set recovery_status = 'redirected',
    redirect_target = s.new_slug,
    last_seen_at = now()
from public.article_slug_redirects s
where s.old_slug = r.slug;

update public.article_url_registry
set recovery_status = 'redirect_candidate',
    retired_reason = 'Historical live-2001 slug: verify canonical year and redirect to corrected article URL.'
where slug like 'live-2001-%'
  and recovery_status = 'pending';

update public.article_url_registry
set recovery_status = 'retired_low_value',
    retired_reason = 'Interactive puzzle/game content intentionally retired; do not recreate solely for historical impressions.'
where recovery_status = 'pending'
  and slug ~* '(crossword|sudoku|word-wrangler|word-wrangler|interactive-puzzles|interactive-daily-cultural-games|daily-cultural-games|word-search|horoscope)';

create or replace function public.register_published_article_url()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  insert into public.article_url_registry (
    slug, canonical_path, first_seen_at, last_seen_at, origin,
    had_search_visibility, gsc_clicks, gsc_impressions, recovery_status, retired_reason
  ) values (
    new.slug,
    '/news/' || new.slug,
    coalesce(new.created_at, new.published_at, now()),
    now(),
    'daily_articles',
    coalesce(new.gsc_impressions,0) > 0 or coalesce(new.gsc_clicks,0) > 0,
    coalesce(new.gsc_clicks,0),
    coalesce(new.gsc_impressions,0),
    'restored',
    null
  )
  on conflict (slug) do update set
    last_seen_at = now(),
    canonical_path = excluded.canonical_path,
    had_search_visibility = public.article_url_registry.had_search_visibility or excluded.had_search_visibility,
    gsc_clicks = greatest(public.article_url_registry.gsc_clicks, excluded.gsc_clicks),
    gsc_impressions = greatest(public.article_url_registry.gsc_impressions, excluded.gsc_impressions),
    recovery_status = 'restored',
    retired_reason = null;
  return new;
end;
$$;

create or replace function public.register_article_slug_redirect()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  insert into public.article_url_registry (
    slug, canonical_path, origin, redirect_target, notes, recovery_status, retired_reason
  ) values (
    new.old_slug,
    '/news/' || new.old_slug,
    'redirect',
    new.new_slug,
    'Canonical redirect recorded in article_slug_redirects',
    'redirected',
    null
  )
  on conflict (slug) do update set
    last_seen_at = now(),
    redirect_target = excluded.redirect_target,
    notes = excluded.notes,
    recovery_status = 'redirected',
    retired_reason = null;
  return new;
end;
$$;

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
  and r.recovery_status = 'pending'
  and d.slug is null
  and s.old_slug is null;

revoke all on public.orphaned_dynamic_search_urls from anon, authenticated;
grant select on public.orphaned_dynamic_search_urls to service_role;

create or replace view public.historical_article_recovery_status
with (security_invoker = true)
as
select r.slug,
       r.canonical_path,
       r.had_search_visibility,
       r.gsc_clicks,
       r.gsc_impressions,
       r.recovery_status,
       r.redirect_target,
       r.retired_reason,
       r.last_seen_at
from public.article_url_registry r
where r.slug like 'live-%';

revoke all on public.historical_article_recovery_status from anon, authenticated;
grant select on public.historical_article_recovery_status to service_role;

comment on view public.historical_article_recovery_status is
  'Service-role-only recovery ledger for historical dynamic KeepTXRed news URLs, including restored, redirected, pending and intentionally retired dispositions.';