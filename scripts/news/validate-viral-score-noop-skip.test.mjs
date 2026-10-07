import { expect, test } from 'vitest';
import fs from 'node:fs';

test('viral scoring skips semantically unchanged feed rows before PostgREST updates', () => {
  const text = fs.readFileSync('src/routes/api/public/hooks/score-viral.ts', 'utf8');
  expect(text).toContain('function stableJson(value: unknown): string');
  expect(text).toContain('classification_confidence,viral_signals,texas_relevance_score,source_reputation_score,routing_type,trend_velocity,source_count,ready_for_rewrite');
  expect(text).toContain('stableJson(row.viral_signals ?? {}) === stableJson(nextViralSignals)');
  expect(text).toContain('skippedUnchanged += 1');
  expect(text).toContain('skippedUnchanged,');
});
