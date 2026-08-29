-- Last-line publication safeguard for generated newsroom articles.
-- A canonical URL and an RSS/feed URL from the same publisher are not two
-- independent sources. Block new clustered newsroom inserts unless the packet
-- has at least one primary/official record or two distinct publisher families.

create or replace function public.newsroom_source_family_from_url(input_url text)
returns text
language plpgsql
immutable
set search_path = public
as $function$
declare
  host text;
  parts text[];
  n integer;
  last_two text;
begin
  if nullif(btrim(input_url), '') is null then
    return null;
  end if;

  host := lower(split_part(regexp_replace(btrim(input_url), '^https?://', '', 'i'), '/', 1));
  host := regexp_replace(host, ':\d+$', '');
  host := regexp_replace(host, '^www\.', '');
  if host = '' then return null; end if;

  parts := string_to_array(host, '.');
  n := coalesce(array_length(parts, 1), 0);
  if n <= 2 then return host; end if;

  last_two := parts[n-1] || '.' || parts[n];
  if last_two in ('co.uk', 'org.uk', 'gov.uk', 'com.au', 'org.au') and n >= 3 then
    return parts[n-2] || '.' || last_two;
  end if;
  return last_two;
end;
$function$;

create or replace function public.guard_generated_newsroom_source_diversity()
returns trigger
language plpgsql
set search_path = public
as $function$
declare
  primary_count integer := 0;
  family_count integer := 0;
begin
  if new.kind is distinct from 'news'
     or new.author is distinct from 'Keep TX Red Newsroom'
     or coalesce((new.body_json->'authority'->>'generatedFromResearchPacket')::boolean, false) is not true
  then
    return new;
  end if;

  primary_count := coalesce((new.body_json->'authority'->>'primarySourceCount')::integer, 0);

  select count(distinct public.newsroom_source_family_from_url(source_row->>'url'))
  into family_count
  from jsonb_array_elements(coalesce(new.body_json->'sources', '[]'::jsonb)) as source_row
  where nullif(public.newsroom_source_family_from_url(source_row->>'url'), '') is not null;

  if primary_count = 0 and family_count < 2 then
    raise exception using
      errcode = '23514',
      message = 'newsroom_source_family_diversity_hold',
      detail = format('Generated newsroom article has %s primary sources and %s distinct publisher families.', primary_count, family_count),
      hint = 'Add an independent publisher family or a substantive primary/official record before publication.';
  end if;

  return new;
end;
$function$;

drop trigger if exists trg_guard_generated_newsroom_source_diversity on public.daily_articles;
create trigger trg_guard_generated_newsroom_source_diversity
before insert on public.daily_articles
for each row execute function public.guard_generated_newsroom_source_diversity();

comment on function public.newsroom_source_family_from_url(text) is
  'Collapses feed/canonical subdomains to one publisher family for newsroom publication safety.';
comment on function public.guard_generated_newsroom_source_diversity() is
  'Rejects new generated newsroom articles with no primary source and fewer than two distinct publisher families.';
