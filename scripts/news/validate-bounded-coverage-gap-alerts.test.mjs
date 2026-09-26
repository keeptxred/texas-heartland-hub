import { expect, test } from 'vitest';
import fs from 'node:fs';

const migration = fs.readFileSync(
  'supabase/migrations/20260926125500_bound_coverage_gap_alerts.sql',
  'utf8',
);

test('coverage gap escalation keeps open alerts bounded to the current top-N set', () => {
  expect(migration).toContain('limit p_limit');
  expect(migration).toContain('current_top');
  expect(migration).toContain("a.incident_key like 'coverage-gap-%'");
  expect(migration).toContain('not exists (select 1 from current_top');
  expect(migration).toContain("set status='resolved'");
  expect(migration).toContain("'alert_limit',p_limit");
  expect(migration).not.toMatch(/delete\s+from\s+public\.publishing_alerts/i);
});
