import { expect, test } from 'vitest';
import fs from 'node:fs';

const builder = fs.readFileSync('src/routes/api/public/hooks/build-newsroom-research-packets.ts', 'utf8');
const targeted = fs.readFileSync('src/routes/api/public/hooks/hydrate-newsroom-source-pages.ts', 'utf8');
const migration = fs.readFileSync('supabase/migrations/20260829150100_newsroom_source_page_fetch_cooldown.sql', 'utf8');

test('automatic newsroom source hydration cools down recent attempts without weakening quality gates', () => {
  for (const token of [
    'const SOURCE_PAGE_FETCH_LIMIT = 40',
    'const SOURCE_PAGE_CONCURRENCY = 4',
    'const SOURCE_PAGE_RETRY_COOLDOWN_MS = 6 * 60 * 60 * 1000',
    'newsroom_source_page_fetch_state',
    'last_attempt_at',
    'sourcePagesCoolingDown',
    'aiCalls: 0',
  ]) expect(builder).toContain(token);

  expect(builder).toContain('shouldFetchNewsroomSourcePage');
  expect(builder).toContain('.upsert(stateRows, { onConflict: "feed_item_id" })');
  expect(builder).not.toContain('SOURCE_PAGE_FETCH_LIMIT = 80');
  expect(builder).not.toContain('SOURCE_PAGE_RETRY_COOLDOWN_MS = 0');
});

test('targeted hydration remains explicit and records attempts for the automatic cooldown', () => {
  for (const token of [
    'POST required',
    'feedIds must contain 1-40 positive integer feed IDs',
    'fetchReadableNewsroomSource(row.link)',
    'newsroom_source_page_fetch_state',
    '.upsert(stateRows, { onConflict: "feed_item_id" })',
    'aiCalls: 0',
  ]) expect(targeted).toContain(token);
});

test('hydration attempt state is service-only and tied to feed history', () => {
  for (const token of [
    'create table if not exists public.newsroom_source_page_fetch_state',
    'feed_item_id bigint primary key references public.texas_news_feed(id) on delete cascade',
    'last_attempt_at timestamptz not null default now()',
    "check (last_result in ('attempted', 'success', 'no_readable_body', 'update_failed'))",
    'alter table public.newsroom_source_page_fetch_state enable row level security',
  ]) expect(migration).toContain(token);
  expect(migration).not.toMatch(/create policy/i);
});
