import { expect, test } from 'vitest';
import fs from 'node:fs';

const scorer = fs.readFileSync('src/routes/api/public/hooks/score-viral.ts', 'utf8');

test('score-viral preserves publisher attribution while consulting discovery provenance', () => {
  expect(scorer).toContain('source,trend_source,link');
  expect(scorer).toContain('trend_source: string | null');
  expect(scorer).toContain('applyTrustedDiscoveryReviewFloor');
  expect(scorer).toContain('SOURCE_REPUTATION_FLOOR');
  expect(scorer).toContain('discovery_source: row.trend_source');
  expect(scorer).toContain('source_account: row.source');
});
