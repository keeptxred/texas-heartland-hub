import { expect, test } from 'vitest';
import fs from 'node:fs';

const migration = fs.readFileSync(
  'supabase/migrations/20260828135000_reconcile_nueces_flyover_review_routing.sql',
  'utf8',
);

test('Nueces Flyover recovery routes to TexasDefined while remaining review-held', () => {
  expect(migration).toContain("target_site = 'texasdefined'");
  expect(migration).toContain("target_section = 'Texas History'");
  expect(migration).toContain('ready_for_rewrite = false');
  expect(migration).toContain("'auto_publish_eligible', false");
  expect(migration).toContain("'editorial_lane', 'REVIEW'");
  expect(migration).toContain('and internal_slug is null');
  expect(migration).not.toContain('ready_for_rewrite = true');
  expect(migration).not.toContain("'auto_publish_eligible', true");
});
