-- Keep restored historical URLs accessible, but do not proactively expose thin
-- restorations to search or AdSense until they have at least 500 substantive
-- main-body words. This data migration uses the existing legacy_thin_content
-- quarantine flag already honored by public readiness, sitemaps, and AdSense.
-- Intentionally do not touch updated_at: quarantine is not editorial freshness.
with legacy_prose as (
  select d.slug,
    concat_ws(' ',
      coalesce((select string_agg(x,' ') from jsonb_array_elements_text(coalesce(d.body_json->'intro','[]'::jsonb)) as i(x)),''),
      coalesce((select string_agg(
        coalesce(s.value->>'heading','') || ' ' ||
        coalesce((select string_agg(p,' ') from jsonb_array_elements_text(coalesce(s.value->'paragraphs','[]'::jsonb)) as pp(p)),'') || ' ' ||
        coalesce((select string_agg(b,' ') from jsonb_array_elements_text(coalesce(s.value->'bullets','[]'::jsonb)) as bb(b)),'')
      ,' ') from jsonb_array_elements(coalesce(d.body_json->'sections','[]'::jsonb)) as s(value)), '')
    ) as prose
  from public.daily_articles d
  where coalesce(d.quality_flags,'{}'::text[]) @> array['legacy_url_restored']::text[]
    and not coalesce(d.quality_flags,'{}'::text[]) @> array['legacy_thin_content']::text[]
), legacy_word_counts as (
  select slug,
    case
      when trim(regexp_replace(prose,'\s+',' ','g')) = '' then 0
      else array_length(regexp_split_to_array(trim(regexp_replace(prose,'\s+',' ','g')),'\s+'),1)
    end as words
  from legacy_prose
)
update public.daily_articles d
set quality_flags = (
  select array_agg(distinct flag order by flag)
  from unnest(coalesce(d.quality_flags,'{}'::text[]) || array['legacy_thin_content']::text[]) as flags(flag)
)
from legacy_word_counts wc
where d.slug = wc.slug
  and wc.words < 500;
