import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const workflow = readFileSync(new URL('../../.github/workflows/sync-gsc-sitewide.yml', import.meta.url), 'utf8');
const script = readFileSync(new URL('./sync-gsc-sitewide.mjs', import.meta.url), 'utf8');
const endpoint = readFileSync(new URL('../../src/routes/api/admin/gsc-sitewide-sync.ts', import.meta.url), 'utf8');

const WORKER_ORIGIN = 'https://keeptxred-site.freddy-coppola.workers.dev';

describe('sitewide GSC transport contract', () => {
  it('uses the deployed Worker origin for GitHub-runner sitemap and write transport', () => {
    expect(workflow).toContain(`GSC_SITEWIDE_FETCH_ORIGIN: ${WORKER_ORIGIN}`);
    expect(workflow).toContain(`GSC_SITEWIDE_SYNC_ENDPOINT: ${WORKER_ORIGIN}/api/admin/gsc-sitewide-sync`);
    expect(script).toContain(`process.env.GSC_SITEWIDE_FETCH_ORIGIN || '${WORKER_ORIGIN}'`);
    expect(script).toContain("response = await fetch(fetchTransportUrl(item.url)");
  });

  it('keeps Search Console and stored URL identity canonical to keeptxred.com', () => {
    expect(workflow).toContain('GSC_SITE_URL: sc-domain:keeptxred.com');
    expect(script).toContain("const queue = [{ url: 'https://keeptxred.com/sitemap.xml', depth: 0 }]");
    expect(script).toContain("'https://keeptxred.com/texas-politics/figures'");
    expect(endpoint).toContain('url.hostname === "keeptxred.com"');
  });

  it('does not broaden the protected write endpoint beyond scheduled or explicit manual runs', () => {
    expect(endpoint).toContain('["schedule", "workflow_dispatch"].includes');
    expect(endpoint).toContain('run?.head_branch !== "main"');
    expect(endpoint).toContain('run?.path !== EXPECTED_WORKFLOW');
    expect(endpoint).not.toContain('["schedule", "workflow_dispatch", "push"]');
  });
});
