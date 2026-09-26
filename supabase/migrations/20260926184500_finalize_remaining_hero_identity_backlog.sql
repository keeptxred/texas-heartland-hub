-- Finalize the remaining published hero backlog with truthful, non-documentary
-- editorial identity graphics. Each graphic is accepted only for its exact article
-- slug and exact repository-owned raster path.

insert into public.repo_migration_equivalences(expected_version, actual_version, actual_name, reason)
values (
  '20260926183000',
  '20260926182614',
  'use_raster_txse_identity_hero',
  'The supported Supabase apply_migration connector applied the exact repository migration SQL and Supabase recorded its execution-time version 20260926182614.'
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
      (article_slug = '2026-09-17-more-young-people-are-getting-involved-with-south-texas-civil-rights-group-amid-' and hero_url = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Lupe_logo_jpeg.jpg')
      or (article_slug = '2026-09-10-texas-stock-exchange-first-primary-listings' and hero_url = '/images/news/editorial/txse-identity.png')
      or (article_slug = '2026-09-18-top-texas-republicans-knew-bo-french-s-history-of-racist-comments-they-supported' and hero_url = '/images/news/editorial/subject-identity/bo-french-endorsement-controversy.png')
      or (article_slug = '2026-09-14-paxton-talarico-affordability-plans-compared' and hero_url = '/images/news/editorial/subject-identity/paxton-talarico-affordability.png')
      or (article_slug = '2026-08-09-daniella-guzman-kprc-return' and hero_url = '/images/news/editorial/subject-identity/daniella-guzman-kprc.png')
      or (article_slug = '2026-08-08-daniella-guzman-kprc-return-ticket-review' and hero_url = '/images/news/editorial/subject-identity/daniella-guzman-kprc.png')
      or (article_slug = '2026-08-09-sarah-acosta-ksat-farewell' and hero_url = '/images/news/editorial/subject-identity/sarah-acosta-ksat.png')
      or (article_slug = '2026-08-08-texas-reserve-officer-mexico-homicides' and hero_url = '/images/news/editorial/subject-identity/chad-eberle-mexico-arrest.png')
      or (article_slug = '2026-08-08-tamu-texarkana-athletics-complex' and hero_url = '/images/news/editorial/subject-identity/tamu-texarkana-athletics.png')
      or (article_slug = '2026-08-08-the-hop-webster-closes-preslees' and hero_url = '/images/news/editorial/subject-identity/the-hop-preslees-webster.png')
    );
$$;

comment on function public.article_hero_is_governed_exact_entity_graphic(text, text, text) is
  'Fail-closed exact slug + exact reusable/local raster URL allowlist for governed editorial identity graphics.';

with fixes(slug, hero_url, alt_text) as (
  values
    ('2026-09-18-top-texas-republicans-knew-bo-french-s-history-of-racist-comments-they-supported', '/images/news/editorial/subject-identity/bo-french-endorsement-controversy.png', 'Editorial identity graphic for the Bo French endorsement controversy; not a documentary photograph.'),
    ('2026-09-14-paxton-talarico-affordability-plans-compared', '/images/news/editorial/subject-identity/paxton-talarico-affordability.png', 'Neutral editorial comparison graphic for the Paxton and Talarico affordability plans; not a photograph of either candidate.'),
    ('2026-08-09-daniella-guzman-kprc-return', '/images/news/editorial/subject-identity/daniella-guzman-kprc.png', 'Editorial identity graphic for Daniella Guzman and KPRC; not a documentary photograph.'),
    ('2026-08-08-daniella-guzman-kprc-return-ticket-review', '/images/news/editorial/subject-identity/daniella-guzman-kprc.png', 'Editorial identity graphic for Daniella Guzman and KPRC; not a documentary photograph.'),
    ('2026-08-09-sarah-acosta-ksat-farewell', '/images/news/editorial/subject-identity/sarah-acosta-ksat.png', 'Editorial identity graphic for Sarah Acosta and KSAT; not a documentary photograph.'),
    ('2026-08-08-texas-reserve-officer-mexico-homicides', '/images/news/editorial/subject-identity/chad-eberle-mexico-arrest.png', 'Editorial identity graphic for the reported Chad Eberle arrest; not a likeness, reenactment, or depiction of alleged conduct.'),
    ('2026-08-08-tamu-texarkana-athletics-complex', '/images/news/editorial/subject-identity/tamu-texarkana-athletics.png', 'Editorial planning graphic for the announced Texas A&M-Texarkana athletics complex; not an architectural rendering or construction photograph.'),
    ('2026-08-08-the-hop-webster-closes-preslees', '/images/news/editorial/subject-identity/the-hop-preslees-webster.png', 'Editorial identity graphic for The Hop-to-Preslee''s venue transition in Webster; not a photograph of either venue.')
)
update public.daily_articles da
set featured_image_url = fixes.hero_url,
    image_url = fixes.hero_url,
    image_alt_text = fixes.alt_text,
    image_generation_status = 'ready',
    image_validation_note = 'exact-entity-graphic-v1 ok: exact article-specific editorial identity graphic matched by both article slug and allowlisted repository-owned raster path; explicitly disclosed as non-documentary artwork.',
    image_candidate_url = null,
    image_candidate_alt_text = null,
    quality_flags = array_remove(array_remove(coalesce(da.quality_flags, '{}'::text[]), 'image_requires_visual_validation'), 'missing_image')
from fixes
where da.slug = fixes.slug;
