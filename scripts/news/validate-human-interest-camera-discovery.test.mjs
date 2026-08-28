import { expect, test } from 'vitest';
import fs from 'node:fs';

const relay = fs.readFileSync('supabase/functions/ktr-rss-relay/index.ts', 'utf8');
const migration = fs.readFileSync(
  'supabase/migrations/20260828215500_add_caught_on_camera_discovery.sql',
  'utf8',
);

test('caught-on-camera Texas human-interest discovery stays narrow and rotated', () => {
  expect(relay).toContain('"google-human-interest-camera"');
  expect(relay).toContain('Texas+%22caught+on+camera%22+when%3A3d');
  expect(migration).toContain('Texas Human Interest — Caught on Camera');
  expect(migration).toContain('feed=google-human-interest-camera&transport=relay');
  expect(migration).toContain("category = 'Non-Political'");
  expect(migration).toContain('enabled = true');
});
