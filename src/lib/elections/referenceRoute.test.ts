import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');
const route = read('../../routes/elections.reference[.]json.ts');
const citationGuide = read('../../routes/citation-guide.tsx');
const llms = read('../../../public/llms.txt');
const pageSitemap = read('../../routes/sitemap-pages[.]xml.ts');
const electionSitemap = read('../../routes/sitemap-elections[.]xml.ts');

describe('Election Central reference JSON route', () => {
  it('remains a server-side noindex support endpoint', () => {
    expect(route).toContain("createFileRoute('/elections/reference.json')");
    expect(route).toContain("import('@/data/elections/2026/races.json')");
    expect(route).toContain("import('@/data/elections/2026/candidates.json')");
    expect(route).toContain("'content-type': 'application/json; charset=utf-8'");
    expect(route).toContain("'x-robots-tag': 'noindex, follow'");
  });

  it('is discoverable from citation guidance but not promoted as a canonical sitemap page', () => {
    expect(citationGuide).toContain('href="/elections/reference.json"');
    expect(llms).toContain('[2026 Election reference JSON](/elections/reference.json)');
    expect(pageSitemap).not.toContain('"/elections/reference.json"');
    expect(electionSitemap).not.toContain('"/elections/reference.json"');
  });
});
