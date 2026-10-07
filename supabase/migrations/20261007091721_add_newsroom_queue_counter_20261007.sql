create table if not exists public.newsroom_queue_counters (
  counter_key text primary key,
  counter_value bigint not null check (counter_value >= 0),
  updated_at timestamptz not null default now()
);

alter table public.newsroom_queue_counters enable row level security;

drop policy if exists "Service role reads newsroom queue counters" on public.newsroom_queue_counters;
create policy "Service role reads newsroom queue counters"
  on public.newsroom_queue_counters
  for select
  to service_role
  using (true);

revoke all privileges on table public.newsroom_queue_counters from public, anon, authenticated;
grant select on table public.newsroom_queue_counters to service_role;

insert into public.newsroom_queue_counters(counter_key,counter_value,updated_at)
select 'texasdefined_story_queue', count(*)::bigint, now()
from public.texas_news_feed
where target_site='texasdefined'
on conflict (counter_key) do update
set counter_value=excluded.counter_value,
    updated_at=excluded.updated_at;

create or replace function public.maintain_newsroom_queue_counters()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  old_td boolean := false;
  new_td boolean := false;
  delta bigint := 0;
begin
  if tg_op <> 'INSERT' then
    old_td := old.target_site = 'texasdefined';
  end if;
  if tg_op <> 'DELETE' then
    new_td := new.target_site = 'texasdefined';
  end if;

  if old_td and not new_td then
    delta := -1;
  elsif new_td and not old_td then
    delta := 1;
  else
    return coalesce(new, old);
  end if;

  update public.newsroom_queue_counters
  set counter_value = greatest(0, counter_value + delta),
      updated_at = now()
  where counter_key='texasdefined_story_queue';

  return coalesce(new, old);
end;
$$;

revoke all on function public.maintain_newsroom_queue_counters() from public, anon, authenticated;
grant execute on function public.maintain_newsroom_queue_counters() to postgres, service_role;

drop trigger if exists maintain_texasdefined_story_queue_counter
  on public.texas_news_feed;

create trigger maintain_texasdefined_story_queue_counter
after insert or delete or update of target_site
on public.texas_news_feed
for each row execute function public.maintain_newsroom_queue_counters();
