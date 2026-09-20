import { expect, test } from 'vitest';
import fs from 'node:fs';

const sql = fs.readFileSync('supabase/migrations/20260827200200_finalize_expanded_discovery_site_routing.sql', 'utf8').toLowerCase();

test('final discovery routing covers deterministic expanded-source signals and retains review', () => {
  for (const token of [
    'tropical storm', 'red raiders', 'commits? to texas tech',
    'midterm convention', 'flock cameras', 'airport security',
    'airport.*(busiest|passenger|record)', 'new h-e-b',
    '\\msettlement\\m', '\\mexpansion\\m', 'screwworm',
  ]) expect(sql).toContain(token);

  expect(sql).toContain("new.target_site := 'keeptxred'");
  expect(sql).toContain("new.target_site := 'texasdefined'");
  expect(sql).toContain("new.target_site := 'review'");
  expect(sql).toContain('internal_slug is null');
  expect(sql).toContain('low_value_utility_page');
});
