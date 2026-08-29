import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const workflow = readFileSync(new URL('../../.github/workflows/broken-link-audit.yml', import.meta.url), 'utf8');

describe('broken-link audit workflow contract', () => {
  it('runs audit-code changes before merge and preserves the verified Worker transport', () => {
    expect(workflow).toContain('pull_request:');
    expect(workflow).toContain("- 'scripts/seo/audit-broken-links.mjs'");
    expect(workflow).toContain("- 'scripts/seo/broken-link-audit-utils.mjs'");
    expect(workflow).toContain("- 'scripts/seo/broken-link-scan-scope.mjs'");
    expect(workflow).toContain('AUDIT_SITE_URL: https://keeptxred.com');
    expect(workflow).toContain('AUDIT_FETCH_ORIGIN: https://keeptxred-site.freddy-coppola.workers.dev');
    expect(workflow).toContain('node scripts/seo/audit-broken-links.mjs --live');
  });

  it('keeps PR and main/scheduled audit concurrency isolated', () => {
    expect(workflow).toContain('group: broken-link-audit-${{ github.event.pull_request.number || github.ref }}');
    expect(workflow).toContain('cancel-in-progress: true');
  });

  it('fails on any static or live broken-link debt', () => {
    expect(workflow).toContain('if (report.summary.staticFindings || report.summary.liveFailures) process.exit(1)');
    expect(workflow).toContain('Migration debt (must be zero)');
  });
});
