-- Remove obsolete KeepTXRed lifestyle links from all stored article bodies after
-- the TexasDefined site split. Link text is preserved; only the broken link is
-- removed. The cleaner is recursive so it covers intro paragraphs, sections,
-- bullets, FAQs, takeaways, sources, and any future nested body_json fields.

create or replace function public.strip_split_site_links_from_text(input_text text)
returns text
language plpgsql
immutable
set search_path = public
as $$
declare
  cleaned text := coalesce(input_text, '');
  moved_path_pattern text := '(?:explore|texas-living|moving-to-texas|moving-to-texas-checklist|texas-resources|texas-data|events|guides|food-bbq)(?:[/#?][^\s\)\]"''<>]*)?';
  absolute_pattern text;
begin
  absolute_pattern := '(?:https?://(?:www\.)?keeptxred\.com)?/' || moved_path_pattern;

  -- Markdown links: [visible text](/old-path) -> visible text
  cleaned := regexp_replace(
    cleaned,
    '\[([^\]]+)\]\((' || absolute_pattern || ')\)',
    '\1',
    'gi'
  );

  -- HTML anchors: <a href="/old-path">visible text</a> -> visible text
  cleaned := regexp_replace(
    cleaned,
    '<a\s+[^>]*href\s*=\s*["''](' || absolute_pattern || ')["''][^>]*>(.*?)</a>',
    '\2',
    'gi'
  );

  -- Bare obsolete URLs are removed rather than left as dead text.
  cleaned := regexp_replace(
    cleaned,
    '(?:https?://(?:www\.)?keeptxred\.com)/' || moved_path_pattern,
    '',
    'gi'
  );

  -- Relative bare paths are only removed when they are clearly presented as a URL.
  cleaned := regexp_replace(
    cleaned,
    '(^|[\s(])/' || moved_path_pattern || '(?=$|[\s).,;:!?])',
    '\1',
    'gi'
  );

  cleaned := regexp_replace(cleaned, '[ \t]{2,}', ' ', 'g');
  cleaned := regexp_replace(cleaned, '\s+([,.;:!?])', '\1', 'g');
  return btrim(cleaned);
end;
$$;

create or replace function public.strip_split_site_links_from_jsonb(input_json jsonb)
returns jsonb
language plpgsql
immutable
set search_path = public
as $$
declare
  result jsonb;
begin
  if input_json is null then
    return null;
  end if;

  case jsonb_typeof(input_json)
    when 'string' then
      return to_jsonb(public.strip_split_site_links_from_text(input_json #>> '{}'));
    when 'array' then
      select coalesce(jsonb_agg(public.strip_split_site_links_from_jsonb(value)), '[]'::jsonb)
      into result
      from jsonb_array_elements(input_json);
      return result;
    when 'object' then
      select coalesce(jsonb_object_agg(key, public.strip_split_site_links_from_jsonb(value)), '{}'::jsonb)
      into result
      from jsonb_each(input_json);
      return result;
    else
      return input_json;
  end case;
end;
$$;

-- Update every article containing an obsolete KeepTXRed lifestyle path.
update public.daily_articles
set body_json = public.strip_split_site_links_from_jsonb(body_json),
    updated_at = now()
where body_json is not null
  and body_json::text ~* '(keeptxred\.com)?/(explore|texas-living|moving-to-texas|moving-to-texas-checklist|texas-resources|texas-data|events|guides|food-bbq)([/#?]|["''\\])';

-- Prevent imported/generated articles from reintroducing the same broken links.
create or replace function public.clean_daily_article_split_site_links()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.body_json is not null then
    new.body_json := public.strip_split_site_links_from_jsonb(new.body_json);
  end if;
  return new;
end;
$$;

drop trigger if exists clean_daily_article_split_site_links_trigger on public.daily_articles;
create trigger clean_daily_article_split_site_links_trigger
before insert or update of body_json on public.daily_articles
for each row
execute function public.clean_daily_article_split_site_links();

comment on function public.strip_split_site_links_from_text(text) is
  'Preserves article wording while removing obsolete KeepTXRed lifestyle links moved during the TexasDefined split.';
comment on function public.strip_split_site_links_from_jsonb(jsonb) is
  'Recursively removes obsolete split-site links from daily_articles.body_json.';
