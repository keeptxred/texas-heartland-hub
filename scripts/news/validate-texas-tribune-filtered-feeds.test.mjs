import { expect, test } from 'vitest';
import fs from 'node:fs';

const migration = fs.readFileSync(
  'supabase/migrations/20260827210000_fix_texas_tribune_filtered_feeds.sql',
  'utf8',
);

test('long-quiet Tribune filtered feeds use current topic and series slugs', () => {
  expect(migration).toContain("The Texas Tribune — Government and Politics");
  expect(migration).toContain('https://www.texastribune.org/topics/state-government/feed');
  expect(migration).toContain("The Texas Tribune — Border");
  expect(migration).toContain('https://www.texastribune.org/topics/immigration/feed');
  expect(migration).toContain("The Texas Tribune — Elections");
  expect(migration).toContain('https://www.texastribune.org/series/texas-2026-election-voting/feed/');
  expect(migration).not.toContain('topics/government/feed');
  expect(migration).not.toContain('topics/border/feed');
  expect(migration).not.toContain('topics/elections/feed');
});
