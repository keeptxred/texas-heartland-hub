import { expect, test } from 'vitest';
import fs from 'node:fs';

const migration = fs.readFileSync('supabase/migrations/20260828153500_finalize_pro_sports_source_guard.sql', 'utf8');

test('final pro sports guard runs last and preserves legitimate Rangers baseball', () => {
  for (const token of [
    'zzzzzzz_guard_texas_pro_sports_discovery_row',
    'routing_lock',
    'routing_locked_site',
    'routing_locked_section',
    'where to watch',
    'call up',
    'insider',
    'Texas Rangers law-enforcement result arrived through pro-sports discovery',
    "new.target_section := 'Sports'",
    "new.target_section := 'Texas News'",
    "new.target_site := 'review'",
  ]) {
    expect(migration).toContain(token);
  }

  expect(migration).toContain("- 'source_contamination'");
  expect(migration).toContain("internal_slug is null");
  expect(migration).not.toContain('delete from public.texas_news_feed');
});
