import fs from 'node:fs';
import { expect, test } from 'vitest';

const migration = fs.readFileSync(
  'supabase/migrations/20260829150500_review_only_local_source_reputation.sql',
  'utf8',
);

const expectedSources = [
  'Houston Public Media',
  'KENS 5 — San Antonio Local',
  'KPRC 2 Click2Houston',
  'KSAT 12 — San Antonio Local',
  'KSAT San Antonio Local',
  'KVIA ABC-7 — El Paso Local',
  'San Antonio Current',
  'Texas Public Radio',
];

test('established Texas local outlets are review-visible but remain below automatic-source authority', () => {
  for (const source of expectedSources) {
    expect(migration).toContain(`'${source}'`);
  }

  expect(migration).toMatch(/source_reputation_score\s*=\s*60/);
  expect(migration).toMatch(/review-visible only \(below 65 automatic-source threshold\)/);
  expect(migration).not.toMatch(/source_reputation_score\s*=\s*(?:6[5-9]|[7-9]\d|100)\b/);
});

test('KSAT scoring alias cannot become a duplicate ingestion source', () => {
  expect(migration).toMatch(/'KSAT San Antonio Local'[\s\S]*?false/);
  expect(migration).toMatch(/WHERE source_name = 'KSAT San Antonio Local'[\s\S]*?AND platform = 'registry'/);
});
