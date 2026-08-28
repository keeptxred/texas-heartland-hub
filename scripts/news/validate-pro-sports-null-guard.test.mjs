import { expect, test } from 'vitest';
import fs from 'node:fs';

const migration = fs.readFileSync(
  'supabase/migrations/20260828233000_fix_pro_sports_null_guard.sql',
  'utf8',
);

test('pro sports quarantine is NULL-safe and repairs only its own unlinked false markers', () => {
  expect(migration).toContain("new.trend_source is distinct from 'Texas Pro Sports — Daily Discovery'");
  expect(migration).toContain("trend_source is distinct from 'Texas Pro Sports — Daily Discovery'");
  expect(migration).toContain('internal_slug is null');
  expect(migration).toContain('texasdefined_slug is null');
  expect(migration).toContain("like 'Texas Pro Sports%'");
  expect(migration).not.toContain("new.trend_source <> 'Texas Pro Sports — Daily Discovery'");
  expect(migration).not.toContain('delete from public.texas_news_feed');
});
