import { describe, expect, it } from 'vitest';
import {
  extractLinkCandidates,
  normalizeInternalLink,
  routeRegexFromRouteName,
} from './broken-link-audit-utils.mjs';

const SITE = 'https://keeptxred.com';

describe('broken-link audit route semantics', () => {
  it('maps TanStack trailing-underscore non-nested routes to their public path', () => {
    const route = routeRegexFromRouteName('texas-politics.figures_.$figureSlug.tsx');
    expect(route.test('/texas-politics/figures/phil-gramm-texas-senator-fiscal-conservative')).toBe(true);
    expect(route.test('/texas-politics/figures_/phil-gramm-texas-senator-fiscal-conservative')).toBe(false);
  });

  it('keeps normal flat, index, pathless, grouped, and dynamic route conventions crawlable', () => {
    expect(routeRegexFromRouteName('tools.index.tsx').test('/tools')).toBe(true);
    expect(routeRegexFromRouteName('_layout.texas-news.$slug.tsx').test('/texas-news/example')).toBe(true);
    expect(routeRegexFromRouteName('(marketing).about.tsx').test('/about')).toBe(true);
    expect(routeRegexFromRouteName('news.$slug.tsx').test('/news/example')).toBe(true);
  });

  it('does not turn generated metadata identifiers into internal URLs', () => {
    expect(normalizeInternalLink('explore_import_jobs', SITE)).toBeNull();
    expect(normalizeInternalLink('keeptxred.com', SITE)).toBeNull();
    expect(normalizeInternalLink('/tools/mortgage-calculator', SITE)).toBe('/tools/mortgage-calculator');
    expect(normalizeInternalLink('https://keeptxred.com/laws', SITE)).toBe('/laws');
  });

  it('rejects route templates and regex source while preserving real navigation objects', () => {
    expect(normalizeInternalLink('/(https', SITE)).toBeNull();
    expect(normalizeInternalLink('/member\\.php\\?d=(\\d+)', SITE)).toBeNull();
    expect(normalizeInternalLink('/elections/races/$raceSlug', SITE)).toBeNull();

    const links = extractLinkCandidates('const item = { to: "/laws", href: "/policy" };');
    expect(links).toContain('/laws');
    expect(links).toContain('/policy');
  });

  it('captures absolute template URLs whole so they are rejected instead of truncated', () => {
    const links = extractLinkCandidates('"machineResourcePattern": "https://keeptxred.com/bills/texas/{legislature}/{bill-type}/{bill-number}/reference.json"');
    expect(links).toContain('https://keeptxred.com/bills/texas/{legislature}/{bill-type}/{bill-number}/reference.json');
    expect(links).not.toContain('https://keeptxred.com/bills/texas/');
    expect(normalizeInternalLink(links[0], SITE)).toBeNull();
  });
});
