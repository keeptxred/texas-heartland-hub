import { expect, test } from 'vitest';
import fs from 'node:fs';

const ingest = fs.readFileSync('src/routes/api/public/hooks/ingest-feeds.ts', 'utf8');
const migration = fs.readFileSync('supabase/migrations/20260827221500_quarantine_panhandle_amarillo_listing_noise.sql', 'utf8');

test('Panhandle Amarillo listing filter is source-specific and entity-safe', () => {
  expect(ingest).toContain('function isRegionalListingNoise');
  expect(ingest).toContain('Texas Panhandle and South Plains — Regional Discovery');
  expect(ingest).toContain('amarillo tribune');
  expect(ingest).toContain('decode(item.description)');
  expect(ingest).toContain('isRegionalListingNoise(item, result.source)');
});

test('existing listing cleanup is non-destructive, entity-safe, and publication-safe', () => {
  expect(migration).toContain("source = 'Amarillo Tribune'");
  expect(migration).toContain('&nbsp;');
  expect(migration).toContain('internal_slug is null');
  expect(migration).toContain('texasdefined_slug is null');
  expect(migration).toContain("'auto_publish_eligible', false");
  expect(migration).not.toContain('delete from');
});
