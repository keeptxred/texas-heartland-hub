import { expect, test } from 'vitest';
import fs from 'node:fs';

const sql = fs.readFileSync('supabase/migrations/20260827195500_expand_discovery_site_routing_vocabulary.sql', 'utf8').toLowerCase();

test('expanded discovery routing keeps explicit KTR, TexasDefined, and review boundaries', () => {
  for (const token of [
    'football', 'golf', 'volleyball', 'athletics',
    'fire chief', 'zoning', 'annexation', 'transportation commission', 'isd',
    'investment', 'plans expansion', 'lease',
    'music venue', 'arcade', 'sportsplex', 'bat experience',
  ]) expect(sql).toContain(token);

  expect(sql).toContain("new.target_site := 'keeptxred'");
  expect(sql).toContain("new.target_site := 'texasdefined'");
  expect(sql).toContain("new.target_site := 'review'");
  expect(sql).toContain("internal_slug is null");
  expect(sql).toContain("interval '14 days'");
  expect(sql).toContain('low_value_utility_page');
});
