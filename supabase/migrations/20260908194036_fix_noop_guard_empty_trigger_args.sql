create or replace function private.skip_semantically_unchanged_update()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
declare
  new_data jsonb := to_jsonb(new);
  old_data jsonb := to_jsonb(old);
  ignored text;
begin
  foreach ignored in array coalesce(tg_argv, array[]::text[]) loop
    new_data := new_data - ignored;
    old_data := old_data - ignored;
  end loop;

  if new_data is not distinct from old_data then
    return null;
  end if;

  return new;
end;
$$;
