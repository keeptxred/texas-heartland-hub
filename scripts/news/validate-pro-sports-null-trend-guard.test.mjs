import { expect, test } from 'vitest';
import fs from 'node:fs';

const migration = fs.readFileSync('supabase/migrations/20260827215800_fix_pro_sports_guard_null_trend_source.sql', 'utf8');

test('pro sports guard is null-safe for unrelated rows', () => {
  expect(migration).toContain("new.trend_source is distinct from 'Texas Pro Sports — Daily Discovery'");
  expect(migration).not.toContain("new.trend_source <> 'Texas Pro Sports — Daily Discovery'");
});

test('cleanup only releases rows carrying this guard exact marker', () => {
  expect(migration).toContain("viral_signals->>'exclusion_reason'");
  expect(migration).toContain('Texas Pro Sports discovery result lacked allowlisted team/sports context or matched Texas Rangers law enforcement');
  expect(migration).toContain('internal_slug is null');
  expect(migration).toContain('texasdefined_slug is null');
});
