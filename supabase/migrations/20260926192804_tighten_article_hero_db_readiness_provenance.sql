create or replace function public.article_hero_has_visual_readiness_provenance(
  note text,
  article_slug text,
  hero_url text
)
returns boolean
language sql
immutable
set search_path = pg_catalog, public
as $$
  select
    coalesce(note, '') ~* 'cloudflare-vision(-v[0-9]+)?[[:space:]]+ok:'
    or (
      lower(btrim(coalesce(note, ''))) like 'authoritative-image-exempt:%'
      and (
        coalesce(hero_url, '') ~* '^https://www\\.nhc\\.noaa\\.gov/storm_graphics/'
        or (
          coalesce(hero_url, '') ~* '^https://www\\.aoml\\.noaa\\.gov/'
          and lower(coalesce(hero_url, '')) like '%hurricane%'
          and lower(coalesce(hero_url, '')) like '%outlook%'
        )
        or (
          article_slug = '2026-09-22-protesters-gather-at-texas-capitol-a-day-after-austin-ice-shooting'
          and hero_url = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Crowd_at_the_Texas_State_Capitol_for_the_No_Kings_Day_Protest_on_June_14,_2025_(54604569560).jpg'
        )
        or (
          article_slug = '2026-09-22-ice-officer-shoots-man-in-north-austin'
          and hero_url = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/U_S_Immigration_and_Customs_Enforcement_conducts_Operation_Secure_Streets_(50044962302).jpg'
        )
        or (
          article_slug = '2026-09-21-man-injured-in-shooting-by-ice-officer-in-north-austin'
          and hero_url = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/U_S_Immigration_and_Customs_Enforcement_conducts_Operation_Secure_Streets_(50044962302).jpg'
        )
      )
    );
$$;

comment on function public.article_hero_has_visual_readiness_provenance(text, text, text) is
  'Fail-closed hero readiness provenance: Cloudflare visual validation or tightly scoped authoritative/manual exemptions bound to the exact hero URL and, where required, article slug.';

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
        public.article_hero_has_visual_readiness_provenance(
          old.image_validation_note,
          old.slug,
          old.featured_image_url
        )
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
      public.article_hero_has_visual_readiness_provenance(
        new.image_validation_note,
        new.slug,
        new.featured_image_url
      )
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
       public.article_hero_has_visual_readiness_provenance(
         new.image_validation_note,
         new.slug,
         new.featured_image_url
       )
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
