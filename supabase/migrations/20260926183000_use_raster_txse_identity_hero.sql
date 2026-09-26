-- Forward-only follow-up for the governed TXSE identity hero.
-- The preceding repository migration was applied through Supabase apply_migration,
-- which records an execution-time version. Preserve that truthful equivalence and
-- move TXSE to a repository-owned raster asset that satisfies the publication contract.

insert into public.repo_migration_equivalences(expected_version, actual_version, actual_name, reason)
values (
  '20260926180000',
  '20260926181438',
  'accept_governed_exact_entity_graphics',
  'The supported Supabase apply_migration connector applied the exact repository migration SQL and Supabase recorded its execution-time version 20260926181438.'
)
on conflict (expected_version) do update
set actual_version = excluded.actual_version,
    actual_name = excluded.actual_name,
    reason = excluded.reason;

create or replace function public.article_hero_is_governed_exact_entity_graphic(
  article_slug text,
  hero_url text,
  validation_note text
)
returns boolean
language sql
immutable
set search_path = pg_catalog, public
as $$
  select
    lower(btrim(coalesce(validation_note, ''))) like 'exact-entity-graphic-v1 ok:%'
    and (
      (
        btrim(coalesce(article_slug, '')) =
          '2026-09-17-more-young-people-are-getting-involved-with-south-texas-civil-rights-group-amid-'
        and btrim(coalesce(hero_url, '')) =
          'https://commons.wikimedia.org/wiki/Special:Redirect/file/Lupe_logo_jpeg.jpg'
      )
      or
      (
        btrim(coalesce(article_slug, '')) =
          '2026-09-10-texas-stock-exchange-first-primary-listings'
        and btrim(coalesce(hero_url, '')) =
          '/images/news/editorial/txse-identity.png'
      )
    );
$$;

comment on function public.article_hero_is_governed_exact_entity_graphic(text, text, text) is
  'Fail-closed exact slug + reusable image URL allowlist for governed identity graphics; an exact-entity note by itself is never sufficient.';

update public.daily_articles
set featured_image_url = '/images/news/editorial/txse-identity.png',
    image_url = '/images/news/editorial/txse-identity.png',
    image_alt_text = 'Texas Stock Exchange editorial identity graphic; not a photograph of the reported listings.',
    image_generation_status = 'ready',
    image_validation_note = 'exact-entity-graphic-v1 ok: exact named-entity identity graphic matched by both article slug and allowlisted reusable source URL; used only when a truthful event photograph is unavailable and labeled as a graphic rather than documentary photography.',
    image_candidate_url = null,
    image_candidate_alt_text = null,
    quality_flags = array_remove(coalesce(quality_flags, '{}'::text[]), 'image_requires_visual_validation')
where slug = '2026-09-10-texas-stock-exchange-first-primary-listings';
