import { expect, test } from 'vitest';
import fs from 'node:fs';

test('live newsroom smoke runs after verified Cloudflare deployment, not before it', () => {
  const workflow = fs.readFileSync('.github/workflows/live-newsroom-smoke.yml', 'utf8');
  expect(workflow).toContain('workflow_run:');
  expect(workflow).toContain('workflows: ["Deploy verified KeepTXRed to Cloudflare"]');
  expect(workflow).toContain("github.event.workflow_run.conclusion == 'success'");
  expect(workflow).toContain("github.event.workflow_run.head_sha");
  expect(workflow).not.toMatch(/\n\s{2}push:\n/);
});
