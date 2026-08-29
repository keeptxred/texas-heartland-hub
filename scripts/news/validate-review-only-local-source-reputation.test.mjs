import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const migration = fs.readFileSync(
  new URL('../../supabase/migrations/20260829150500_review_only_local_source_reputation.sql', import.meta.url),
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
    assert.ok(migration.includes(`'${source}'`), `missing source reputation entry: ${source}`);
  }

  assert.match(migration, /source_reputation_score\s*=\s*60/);
  assert.match(migration, /review-visible only \(below 65 automatic-source threshold\)/);
  assert.ok(!/source_reputation_score\s*=\s*(?:6[5-9]|[7-9]\d|100)\b/.test(migration));
});

test('KSAT scoring alias cannot become a duplicate ingestion source', () => {
  assert.match(migration, /'KSAT San Antonio Local'[\s\S]*?false/);
  assert.match(migration, /WHERE source_name = 'KSAT San Antonio Local'[\s\S]*?AND platform = 'registry'/);
});
