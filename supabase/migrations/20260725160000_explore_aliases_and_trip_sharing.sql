create or replace function public.autocomplete_explore_entities(
  search_query text,
  result_limit integer default 8
) returns table (
  name text,
  slug text,
  entity_type text,
  region text
) language sql stable security invoker set search_path = public as $$
  select e.name, e.slug, e.entity_type, e.region
  from public.explore_public_entities e
  where nullif(trim(search_query), '') is not null
    and (
      e.name ilike '%' || search_query || '%'
      or search_query % e.name
      or exists (
        select 1 from unnest(e.alternate_names) alias
        where alias ilike '%' || search_query || '%'
      )
    )
  order by
    case when lower(e.name) like lower(search_query) || '%' then 0 else 1 end,
    similarity(e.name, search_query) desc,
    e.name
  limit least(greatest(result_limit, 1), 12);
$$;

grant execute on function public.autocomplete_explore_entities(text,integer) to anon, authenticated;
