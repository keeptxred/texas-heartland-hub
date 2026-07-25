create table if not exists public.explore_entity_slugs (
  slug text primary key,
  entity_id uuid not null references public.explore_entities(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.explore_entity_slugs enable row level security;

drop policy if exists "Published Explore aliases are public" on public.explore_entity_slugs;
create policy "Published Explore aliases are public" on public.explore_entity_slugs
  for select using (
    exists (
      select 1 from public.explore_entities e
      where e.id = entity_id and e.status = 'published'
    )
  );

do $$ begin
  if to_regprocedure('public.has_role(uuid,public.app_role)') is not null then
    execute 'create policy "Admins manage Explore aliases" on public.explore_entity_slugs for all to authenticated using (public.has_role(auth.uid(), ''admin'')) with check (public.has_role(auth.uid(), ''admin''))';
  end if;
exception when duplicate_object then null; end $$;

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
  from public.explore_entities e
  where e.status = 'published'
    and nullif(trim(search_query), '') is not null
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
