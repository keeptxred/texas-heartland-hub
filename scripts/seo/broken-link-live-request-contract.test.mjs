import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync(new URL('./audit-broken-links.mjs', import.meta.url), 'utf8');

describe('broken-link live request contract', () => {
  it('uses a browser-compatible request identity without suppressing HTTP failures', () => {
    expect(source).toContain("Chrome/151.0.0.0 Safari/537.36 KeepTXRed-Link-Audit/1.2");
    expect(source).toContain("accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'");
    expect(source).toContain("if (!response.ok) return [{ url, sitemapFailure: response.status, attempts }]");
    expect(source).toContain("severity: 'blocking'");
    expect(source).not.toContain('response.status === 403');
  });

  it('prints the concrete sitemap status when live checks fail', () => {
    expect(source).toContain('item.sitemapFailure');
    expect(source).toContain('printBlockingLiveFailures(blockingLive)');
  });

  it('does not classify the active governed guide route family as retired', () => {
    const retiredPrefixBlock = source.match(/const RETIRED_PREFIXES = \[[\s\S]*?\];/)?.[0] ?? '';
    expect(retiredPrefixBlock).not.toContain("'/guides'");
    expect(source).toContain("const RETIRED_PREFIXES = [");
  });
});
