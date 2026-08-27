import { expect, test } from 'vitest';
import fs from 'node:fs';

const migration = fs.readFileSync('supabase/migrations/20260827214500_add_flyover_aug10_reconciliation_ledger.sql', 'utf8');
const endpoint = fs.readFileSync('src/routes/api/public/flyover-aug10-health.ts', 'utf8');

const keys = [
  'state-fair-gun-ban','fort-worth-alligators-shot','don-nelson','ingram-school-flood-repairs','st-louis-encephalitis',
  'lakeside-fentanyl-children','dallas-pedestrian-waymo','canyon-lake-full','bastrop-council-retreat','kaylee-hottle-scholarship',
  'tate-taylor-sprint-double','texas-stadium-mavericks-redevelopment','cowboys-quinnen-williams','rangers-jonah-bride','heb-store-upgrades',
  'caseys-pak-a-sak','sushi-door-dash-dispute','texas-born-county-ranking','eds-plano-implosion','richardson-lego-public-safety',
  'kris6-anchor-layoffs','3d-printed-wheelchair','nueces-1862-history',
];

test('Aug. 10 Flyover reconciliation uses a stable 23-key ledger', () => {
  expect(keys).toHaveLength(23);
  for (const key of keys) expect(migration).toContain(`'${key}'`);
  expect(migration).toContain("'out_of_scope'");
  expect(migration).toContain('do not force it onto a Texas site');
});

test('public Flyover health endpoint reports ledger dispositions without publishing', () => {
  expect(endpoint).toContain('flyover_aug10_reconciliation');
  expect(endpoint).toContain('benchmarkSize: 23');
  expect(endpoint).toContain('reviewReady');
  expect(endpoint).toContain('sourceNeeded');
  expect(endpoint).toContain('outOfScope');
  expect(endpoint).not.toContain('daily_articles').and.not.toContain('insert(').and.not.toContain('upsert(');
});
