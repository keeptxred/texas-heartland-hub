-- Facebook group share automation control plane.
-- Browser interaction is performed by the user's local runner; Facebook credentials
-- are never stored in Supabase. Tables are server-only (RLS enabled, no client policies).

create table if not exists public.facebook_group_automation_settings (
  id smallint primary key default 1 check (id = 1),
  enabled boolean not null default false,
  mode text not null default 'manual' check (mode in ('manual', 'assisted', 'fully_automated')),
  daily_min smallint not null default 3 check (daily_min between 1 and 20),
  daily_max smallint not null default 5 check (daily_max between 1 and 20 and daily_max >= daily_min),
  window_start time without time zone not null default '09:00',
  window_end time without time zone not null default '20:00',
  timezone text not null default 'America/Chicago',
  min_gap_minutes smallint not null default 45 check (min_gap_minutes between 10 and 720),
  updated_at timestamptz not null default now(),
  check (window_end > window_start)
);

insert into public.facebook_group_automation_settings (id)
values (1)
on conflict (id) do nothing;

create table if not exists public.facebook_group_targets (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 160),
  group_url text not null unique check (group_url ~* '^https://(www\.)?facebook\.com/groups/'),
  active boolean not null default true,
  sort_order integer not null default 0,
  last_shared_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.facebook_group_share_queue (
  id uuid primary key default extensions.gen_random_uuid(),
  source_queue_id uuid references public.publishing_queue(id) on delete set null,
  content_package_id uuid references public.content_packages(id) on delete set null,
  group_target_id uuid not null references public.facebook_group_targets(id) on delete cascade,
  page_post_url text not null check (page_post_url ~* '^https?://'),
  article_url text,
  caption text not null default '',
  scheduled_at timestamptz not null,
  status text not null default 'PENDING' check (status in ('PENDING', 'CLAIMED', 'AWAITING_CONFIRMATION', 'POSTED', 'FAILED', 'CANCELED')),
  mode_snapshot text not null check (mode_snapshot in ('manual', 'assisted', 'fully_automated')),
  attempts integer not null default 0 check (attempts >= 0),
  runner_id text,
  claimed_at timestamptz,
  posted_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source_queue_id, group_target_id)
);

create index if not exists facebook_group_share_queue_due_idx
  on public.facebook_group_share_queue (status, scheduled_at);
create index if not exists facebook_group_share_queue_group_idx
  on public.facebook_group_share_queue (group_target_id, scheduled_at desc);

alter table public.facebook_group_automation_settings enable row level security;
alter table public.facebook_group_targets enable row level security;
alter table public.facebook_group_share_queue enable row level security;

revoke all on public.facebook_group_automation_settings from anon, authenticated;
revoke all on public.facebook_group_targets from anon, authenticated;
revoke all on public.facebook_group_share_queue from anon, authenticated;
grant select, insert, update, delete on public.facebook_group_automation_settings to service_role;
grant select, insert, update, delete on public.facebook_group_targets to service_role;
grant select, insert, update, delete on public.facebook_group_share_queue to service_role;

create or replace function public.enqueue_facebook_group_shares(p_source_queue_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  s public.facebook_group_automation_settings%rowtype;
  src public.publishing_queue%rowtype;
  pkg public.content_packages%rowtype;
  local_now timestamp without time zone;
  target_date date;
  existing_count integer;
  desired_count integer;
  capacity integer;
  eligible_count integer;
  take_count integer;
  target public.facebook_group_targets%rowtype;
  idx integer := 0;
  created_count integer := 0;
  window_start_at timestamptz;
  window_end_at timestamptz;
  span_seconds double precision;
  slot_seconds double precision;
  jitter_seconds double precision;
  candidate_at timestamptz;
  day_tries integer := 0;
begin
  select * into s
  from public.facebook_group_automation_settings
  where id = 1;

  if not found or not s.enabled then
    return 0;
  end if;

  select * into src
  from public.publishing_queue
  where id = p_source_queue_id;

  if not found or lower(src.platform) <> 'facebook' or src.status <> 'PUBLISHED' then
    return 0;
  end if;

  if coalesce(src.notes, '') !~* '^https?://(www\.)?facebook\.com/' then
    return 0;
  end if;

  select * into pkg
  from public.content_packages
  where id = src.content_package_id;

  if not found then
    return 0;
  end if;

  local_now := timezone(s.timezone, now());
  target_date := local_now::date;
  if local_now::time >= s.window_end then
    target_date := target_date + 1;
  end if;

  -- Find the first day within a week that still has room and unused groups.
  loop
    exit when day_tries >= 7;

    select count(*) into existing_count
    from public.facebook_group_share_queue q
    where q.status <> 'CANCELED'
      and (q.scheduled_at at time zone s.timezone)::date = target_date;

    desired_count := floor(random() * (s.daily_max - s.daily_min + 1))::integer + s.daily_min;
    capacity := least(desired_count, s.daily_max - existing_count);

    select count(*) into eligible_count
    from public.facebook_group_targets g
    where g.active
      and not exists (
        select 1
        from public.facebook_group_share_queue q
        where q.source_queue_id = p_source_queue_id
          and q.group_target_id = g.id
      )
      and not exists (
        select 1
        from public.facebook_group_share_queue q
        where q.group_target_id = g.id
          and q.status <> 'CANCELED'
          and (q.scheduled_at at time zone s.timezone)::date = target_date
      );

    take_count := least(greatest(capacity, 0), eligible_count);
    exit when take_count > 0;

    target_date := target_date + 1;
    day_tries := day_tries + 1;
  end loop;

  if take_count <= 0 then
    return 0;
  end if;

  window_start_at := (target_date + s.window_start)::timestamp at time zone s.timezone;
  window_end_at := (target_date + s.window_end)::timestamp at time zone s.timezone;

  if target_date = local_now::date then
    window_start_at := greatest(window_start_at, now() + interval '10 minutes');
  end if;

  if window_start_at >= window_end_at then
    target_date := target_date + 1;
    window_start_at := (target_date + s.window_start)::timestamp at time zone s.timezone;
    window_end_at := (target_date + s.window_end)::timestamp at time zone s.timezone;
  end if;

  span_seconds := extract(epoch from (window_end_at - window_start_at));
  slot_seconds := span_seconds / (take_count + 1);
  jitter_seconds := least(slot_seconds * 0.18, 600.0);

  for target in
    select g.*
    from public.facebook_group_targets g
    where g.active
      and not exists (
        select 1
        from public.facebook_group_share_queue q
        where q.source_queue_id = p_source_queue_id
          and q.group_target_id = g.id
      )
      and not exists (
        select 1
        from public.facebook_group_share_queue q
        where q.group_target_id = g.id
          and q.status <> 'CANCELED'
          and (q.scheduled_at at time zone s.timezone)::date = target_date
      )
    order by g.last_shared_at nulls first, g.sort_order, random()
    limit take_count
  loop
    idx := idx + 1;
    candidate_at := window_start_at
      + make_interval(secs => round(idx * slot_seconds + ((random() * 2.0 - 1.0) * jitter_seconds))::integer);

    insert into public.facebook_group_share_queue (
      source_queue_id,
      content_package_id,
      group_target_id,
      page_post_url,
      article_url,
      caption,
      scheduled_at,
      mode_snapshot
    ) values (
      src.id,
      src.content_package_id,
      target.id,
      src.notes,
      pkg.source_url,
      trim(concat_ws(E'\n\n', nullif(pkg.facebook_hook, ''), nullif(pkg.facebook_body, ''))),
      candidate_at,
      s.mode
    )
    on conflict (source_queue_id, group_target_id) do nothing;

    if found then
      created_count := created_count + 1;
    end if;
  end loop;

  return created_count;
end;
$$;

revoke all on function public.enqueue_facebook_group_shares(uuid) from public, anon, authenticated;
grant execute on function public.enqueue_facebook_group_shares(uuid) to service_role;

create or replace function public.facebook_group_queue_after_page_publish()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if lower(new.platform) = 'facebook'
     and new.status = 'PUBLISHED'
     and (tg_op = 'INSERT' or old.status is distinct from new.status) then
    perform public.enqueue_facebook_group_shares(new.id);
  end if;
  return new;
end;
$$;

revoke all on function public.facebook_group_queue_after_page_publish() from public, anon, authenticated;
grant execute on function public.facebook_group_queue_after_page_publish() to service_role;

drop trigger if exists trg_facebook_group_queue_after_page_publish on public.publishing_queue;
create trigger trg_facebook_group_queue_after_page_publish
after insert or update of status on public.publishing_queue
for each row
execute function public.facebook_group_queue_after_page_publish();

comment on table public.facebook_group_automation_settings is
  'Server-only settings for distributing published Facebook Page posts to saved Facebook groups through a user-owned local browser runner.';
comment on table public.facebook_group_share_queue is
  'Server-only queue consumed by the user-owned local browser runner. No Facebook credentials are stored here.';
