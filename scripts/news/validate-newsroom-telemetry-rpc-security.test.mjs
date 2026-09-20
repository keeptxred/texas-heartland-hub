import { expect, test } from 'vitest';
import fs from 'node:fs';

const rpcMigration = fs.readFileSync('supabase/migrations/20260828155000_restrict_news_source_fetch_state_capture_rpc.sql', 'utf8');
const viewMigration = fs.readFileSync('supabase/migrations/20260828155200_harden_news_coverage_gaps_view_security.sql', 'utf8');

test('news source fetch-state capture is service-role only', () => {
  expect(rpcMigration).toContain('revoke all on function public.capture_news_source_fetch_state() from public');
  expect(rpcMigration).toContain('revoke all on function public.capture_news_source_fetch_state() from anon');
  expect(rpcMigration).toContain('revoke all on function public.capture_news_source_fetch_state() from authenticated');
  expect(rpcMigration).toContain('grant execute on function public.capture_news_source_fetch_state() to service_role');
  expect(rpcMigration).not.toContain('grant execute on function public.capture_news_source_fetch_state() to anon');
});

test('coverage gap reporting uses invoker security and read-only client grants', () => {
  expect(viewMigration).toContain('security_invoker = true');
  expect(viewMigration).toContain('grant select on public.news_coverage_gaps to authenticated');
  expect(viewMigration).toContain('grant select on public.news_coverage_gaps to service_role');
  expect(viewMigration).toContain('revoke insert, update, delete, truncate, references, trigger');
  expect(viewMigration).not.toContain('grant select on public.news_coverage_gaps to anon');
});
