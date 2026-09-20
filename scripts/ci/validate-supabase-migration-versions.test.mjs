import fs from 'node:fs';
import path from 'node:path';
import { expect, test } from 'vitest';

const migrationsDir = path.resolve('supabase/migrations');

function migrationVersion(filename) {
  const match = /^(\d{14})_/.exec(filename);
  return match?.[1] ?? null;
}

test('Supabase migration versions are unique', () => {
  const sqlFiles = fs
    .readdirSync(migrationsDir)
    .filter((filename) => filename.endsWith('.sql'))
    .sort();

  const byVersion = new Map();
  for (const filename of sqlFiles) {
    const version = migrationVersion(filename);
    if (!version) continue;
    const filenames = byVersion.get(version) ?? [];
    filenames.push(filename);
    byVersion.set(version, filenames);
  }

  const duplicates = [...byVersion.entries()]
    .filter(([, filenames]) => filenames.length > 1)
    .map(([version, filenames]) => ({ version, filenames }));

  expect(duplicates, `Duplicate Supabase migration versions found: ${JSON.stringify(duplicates)}`).toEqual([]);
});
