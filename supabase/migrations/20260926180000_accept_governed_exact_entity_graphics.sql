-- Keep database hero-readiness enforcement aligned with the application-level
-- exact-entity graphic allowlist. This remains fail-closed: the note alone is
-- insufficient; both the article slug and exact reusable image URL must match.

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
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6b/TXSE_logo_Sep_2024.svg/1280px-TXSE_logo_Sep_2024.svg.png'
      )
    );
$$;

comment on function public.article_hero_is_governed_exact_entity_graphic(text, text, text) is
  'Fail-closed exact slug + reusable image URL allowlist for governed identity graphics; an exact-entity note by itself is never sufficient.';

create or replace function public.enforce_article_hero_visual_readiness()
returns trigger
language plpgsql
set search_path = public, pg_catalog
as $$
declare
  candidate_url text;
  candidate_alt text;
  candidate_note text;
  old_ready boolean := false;
  new_ready boolean := false;
  candidate_was_quarantined boolean := false;
begin
  if tg_op = 'UPDATE' then
    old_ready := nullif(btrim(coalesce(old.featured_image_url, '')), '') is not null
      and lower(coalesce(old.image_generation_status, '')) = 'ready'
      and (
        public.article_hero_has_visual_readiness_provenance(old.image_validation_note)
        or public.article_hero_is_governed_exact_entity_graphic(
          old.slug,
          old.featured_image_url,
          old.image_validation_note
        )
      );

    if old.image_validation_note is distinct from new.image_validation_note
       and nullif(btrim(coalesce(old.image_validation_note, '')), '') is not null
    then
      new.image_validation_history := coalesce(old.image_validation_history, '[]'::jsonb)
        || jsonb_build_array(jsonb_build_object(
          'at', now(),
          'event', 'validation_note_replaced',
          'url', old.featured_image_url,
          'note', left(old.image_validation_note, 1000)
        ));
    end if;
  end if;

  new_ready := nullif(btrim(coalesce(new.featured_image_url, '')), '') is not null
    and lower(coalesce(new.image_generation_status, '')) = 'ready'
    and (
      public.article_hero_has_visual_readiness_provenance(new.image_validation_note)
      or public.article_hero_is_governed_exact_entity_graphic(
        new.slug,
        new.featured_image_url,
        new.image_validation_note
      )
    );

  if nullif(btrim(coalesce(new.featured_image_url, '')), '') is not null
     and lower(coalesce(new.image_generation_status, '')) = 'ready'
     and not new_ready
  then
    candidate_was_quarantined := true;
    candidate_url := new.featured_image_url;
    candidate_alt := new.image_alt_text;
    candidate_note := new.image_validation_note;

    new.image_candidate_url := candidate_url;
    new.image_candidate_alt_text := candidate_alt;
    new.quality_flags := array(
      select distinct flag
      from unnest(coalesce(new.quality_flags, '{}'::text[]) || array['image_requires_visual_validation']::text[]) as flag
    );
    new.image_validation_history := coalesce(new.image_validation_history, '[]'::jsonb)
      || jsonb_build_array(jsonb_build_object(
        'at', now(),
        'event', 'unvalidated_candidate_quarantined',
        'url', candidate_url,
        'note', left(coalesce(candidate_note, 'No validation note supplied.'), 1000)
      ));

    if tg_op = 'UPDATE' and old_ready then
      new.featured_image_url := old.featured_image_url;
      new.image_url := old.image_url;
      new.image_alt_text := old.image_alt_text;
      new.image_generation_status := old.image_generation_status;
      new.image_validation_note := old.image_validation_note;
    else
      new.featured_image_url := null;
      if new.image_url is null or new.image_url = candidate_url then
        new.image_url := null;
      end if;
      new.image_alt_text := null;
      new.image_generation_status := 'pending';
      new.image_validation_note := 'hero-readiness hold: candidate requires visual validation before publication';
    end if;
  end if;

  if not candidate_was_quarantined
     and (
       public.article_hero_has_visual_readiness_provenance(new.image_validation_note)
       or public.article_hero_is_governed_exact_entity_graphic(
         new.slug,
         new.featured_image_url,
         new.image_validation_note
       )
     )
     and nullif(btrim(coalesce(new.featured_image_url, '')), '') is not null
  then
    new.quality_flags := array_remove(coalesce(new.quality_flags, '{}'::text[]), 'image_requires_visual_validation');
    new.image_candidate_url := null;
    new.image_candidate_alt_text := null;
  end if;

  return new;
end;
$$;

comment on function public.enforce_article_hero_visual_readiness() is
  'Quarantines unvalidated ready hero assignments while allowing only exact slug+URL governed identity graphics in addition to existing visual/official provenance.';

-- Reconcile the two rows that the current application audit already governs.
update public.daily_articles
set featured_image_url = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Lupe_logo_jpeg.jpg',
    image_url = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Lupe_logo_jpeg.jpg',
    image_alt_text = coalesce(nullif(image_candidate_alt_text, ''), nullif(image_alt_text, ''), 'La Unión del Pueblo Entero (LUPE) identity graphic'),
    image_generation_status = 'ready',
    image_validation_note = 'exact-entity-graphic-v1 ok: exact named-entity identity graphic matched by both article slug and allowlisted reusable source URL; used only when a truthful event photograph is unavailable and labeled as a graphic rather than documentary photography.',
    image_candidate_url = null,
    image_candidate_alt_text = null,
    quality_flags = array_remove(coalesce(quality_flags, '{}'::text[]), 'image_requires_visual_validation')
where slug = '2026-09-17-more-young-people-are-getting-involved-with-south-texas-civil-rights-group-amid-';

update public.daily_articles
set featured_image_url = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6b/TXSE_logo_Sep_2024.svg/1280px-TXSE_logo_Sep_2024.svg.png',
    image_url = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6b/TXSE_logo_Sep_2024.svg/1280px-TXSE_logo_Sep_2024.svg.png',
    image_alt_text = coalesce(nullif(image_candidate_alt_text, ''), nullif(image_alt_text, ''), 'Texas Stock Exchange identity graphic'),
    image_generation_status = 'ready',
    image_validation_note = 'exact-entity-graphic-v1 ok: exact named-entity identity graphic matched by both article slug and allowlisted reusable source URL; used only when a truthful event photograph is unavailable and labeled as a graphic rather than documentary photography.',
    image_candidate_url = null,
    image_candidate_alt_text = null,
    quality_flags = array_remove(coalesce(quality_flags, '{}'::text[]), 'image_requires_visual_validation')
where slug = '2026-09-10-texas-stock-exchange-first-primary-listings';
