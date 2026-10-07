import { expect, test } from 'vitest';
import fs from 'node:fs';

test('viral scoring retries transient statement-timeout updates and reports failures', () => {
  const text = fs.readFileSync('src/routes/api/public/hooks/score-viral.ts', 'utf8');
  expect(text).toContain('async function updateFeedRowWithRetry');
  expect(text).toContain('error.code === "57014"');
  expect(text).toContain('retries >= 2');
  expect(text).toContain('updateRetries += updateResult.retries');
  expect(text).toContain('updateFailures += 1');
  expect(text).toContain('updateErrors,');
});
