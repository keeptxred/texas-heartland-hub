import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const workflow = readFileSync(new URL('../../.github/workflows/sync-gsc-sitewide.yml', import.meta.url), 'utf8');
const script = readFileSync(new URL('./sync-gsc-sitewide.mjs', import.meta.url), 'utf8');
const endpoint = readFileSync(new URL('../../src/routes/api/admin/gsc-sitewide-sync.ts', import.meta.url), 'utf8');

const WORKER_ORIGIN = 'https://keeptxred-site.freddy-coppola.workers.dev';

describe('sitewide GSC transport contract', () => {
  it('uses the direct Worker origin for sitemap transport and protected writes', () => {
    expect(workflow).toContain(`GSC_SITEWIDE_FETCH_ORIGIN: ${WORKER_ORIGIN}`);
    expect(workflow).toContain(`GSC_SITEWIDE_SYNC_ENDPOINT: ${WORKER_ORIGIN}/api/admin/gsc-sitewide-sync`);
    expect(script).toContain(`process.env.GSC_SITEWIDE_FETCH_ORIGIN || '${WORKER_ORIGIN}'`);
    expect(script).toContain("const syncEndpoint = process.env.GSC_SITEWIDE_SYNC_ENDPOINT || `${fetchOrigin}/api/admin/gsc-sitewide-sync`");
    expect(script).toContain("response = await fetch(fetchTransportUrl(item.url)");
  });

  it('keeps Search Console and stored URL identity canonical to keeptxred.com', () => {
    expect(workflow).toContain('GSC_SITE_URL: sc-domain:keeptxred.com');
    expect(script).toContain("const queue = [{ url: 'https://keeptxred.com/sitemap.xml', depth: 0 }]");
    expect(script).toContain("'https://keeptxred.com/texas-politics/figures'");
    expect(endpoint).toContain('url.hostname === "keeptxred.com"');
  });

  it('backfills finalized daily page history with date and page dimensions', () => {
    expect(workflow).toContain('GSC_SITEWIDE_LOOKBACK_DAYS: "90"');
    expect(script).toContain('GSC_SITEWIDE_LOOKBACK_DAYS || 90');
    expect(script).toContain("dimensions: ['date', 'page']");
    expect(script).toContain('startDate: metricStartDate');
    expect(script).toContain('endDate: metricDate');
    expect(script).toContain('metrics.slice(index, index + 500)');
  });

  it('keeps the protected write endpoint limited to the canonical workflow on active main runs', () => {
    expect(endpoint).toContain('["schedule", "workflow_dispatch", "push"].includes');
    expect(endpoint).toContain('run?.head_branch !== "main"');
    expect(endpoint).toContain('run?.path !== EXPECTED_WORKFLOW');
    expect(endpoint).toContain('["queued", "in_progress"].includes');
    expect(endpoint).not.toContain('"pull_request"');
  });
});
