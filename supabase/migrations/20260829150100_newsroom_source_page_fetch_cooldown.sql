-- Prevent bounded newsroom source hydration from being monopolized by the same
-- blocked or already-short source pages every 15-minute packet cycle.
-- Server-side newsroom hooks use the service role; no client access is needed.

create table if not exists public.newsroom_source_page_fetch_state (
  feed_item_id bigint primary key references public.texas_news_feed(id) on delete cascade,
  last_attempt_at timestamptz not null default now(),
  last_success_at timestamptz,
  last_result text not null default 'attempted'
    check (last_result in ('attempted', 'success', 'no_readable_body', 'update_failed')),
  chars integer not null default 0 check (chars >= 0)
);

create index if not exists newsroom_source_page_fetch_state_last_attempt_idx
  on public.newsroom_source_page_fetch_state (last_attempt_at);

alter table public.newsroom_source_page_fetch_state enable row level security;

comment on table public.newsroom_source_page_fetch_state is
  'Server-only attempt state used to cool down repeated newsroom source-page hydration so blocked/short pages cannot starve the bounded fetch queue.';
comment on column public.newsroom_source_page_fetch_state.last_attempt_at is
  'Most recent automatic or targeted source-page hydration attempt.';
comment on column public.newsroom_source_page_fetch_state.last_success_at is
  'Most recent attempt that returned readable source text, even if the cached body was already equivalent or better.';
comment on column public.newsroom_source_page_fetch_state.last_result is
  'Latest fetch outcome: attempted, success, no_readable_body, or update_failed.';
