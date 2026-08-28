import { expect, test } from 'vitest';
import fs from 'node:fs';

const migration = fs.readFileSync('supabase/migrations/20260828155000_restrict_news_source_fetch_state_capture_rpc.sql', 'utf8');

test('news source fetch-state capture is service-role only', () => {
  expect(migration).toContain('revoke all on function public.capture_news_source_fetch_state() from public');
  expect(migration).toContain('revoke all on function public.capture_news_source_fetch_state() from anon');
  expect(migration).toContain('revoke all on function public.capture_news_source_fetch_state() from authenticated');
  expect(migration).toContain('grant execute on function public.capture_news_source_fetch_state() to service_role');
  expect(migration).not.toContain('grant execute on function public.capture_news_source_fetch_state() to anon');
});
