import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync(new URL('./audit-broken-links.mjs', import.meta.url), 'utf8');

describe('broken-link live request contract', () => {
  it('uses a clean browser request identity without suppressing HTTP failures', () => {
    expect(source).toContain("Chrome/151.0.0.0 Safari/537.36'");
    expect(source).not.toContain('KeepTXRed-Link-Audit');
    expect(source).toContain("accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'");
    expect(source).toContain("'accept-language': 'en-US,en;q=0.9'");
    expect(source).toContain("if (!response.ok) return [{ url, sitemapFailure: response.status, attempts }]");
    expect(source).toContain("severity: 'blocking'");
    expect(source).not.toContain('response.status === 403');
  });

  it('keeps canonical identity separate from the verified live fetch origin', () => {
    expect(source).toContain("const SITE = process.env.AUDIT_SITE_URL || 'https://keeptxred.com'");
    expect(source).toContain('const LIVE_FETCH_ORIGIN = process.env.AUDIT_FETCH_ORIGIN || SITE');
    expect(source).toContain('function auditFetchUrl(canonicalUrl)');
    expect(source).toContain('const requestUrl = auditFetchUrl(url)');
    expect(source).toContain('site: SITE');
    expect(source).toContain('liveFetchOrigin: FETCH_ORIGIN');
  });

  it('prints the concrete sitemap status when live checks fail', () => {
    expect(source).toContain('item.sitemapFailure');
    expect(source).toContain('printBlockingLiveFailures(blockingLive)');
  });

  it('does not classify active governed route families as retired', () => {
    const retiredPrefixBlock = source.match(/const RETIRED_PREFIXES = \[[\s\S]*?\];/)?.[0] ?? '';
    expect(retiredPrefixBlock).not.toContain("'/guides'");
    expect(retiredPrefixBlock).toContain("'/explore'");
  });

  it('exempts only the exact retained KTR-only Explore guides from migration debt', () => {
    const activeBlock = source.match(/const ACTIVE_LEGACY_PATHS = new Set\(\[[\s\S]*?\]\);/)?.[0] ?? '';
    expect(activeBlock).toContain("'/explore/scenic-rivers'");
    expect(activeBlock).toContain("'/explore/texas-dark-sky-stargazing'");
    expect(activeBlock).toContain("'/explore/major-springs'");
    expect(activeBlock).not.toContain("'/explore/search'");
    expect(activeBlock).not.toContain("'/explore/trip-planner'");
    expect(source).toContain('if (ACTIVE_LEGACY_PATHS.has(pathname)) return false');
    expect(source).toContain('const retired = isRetiredPath(pathname)');
    expect(source).toContain('if (isRetiredPath(link.pathname))');
  });
});
