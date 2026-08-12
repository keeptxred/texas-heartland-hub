import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');
const manifest = JSON.parse(read('../../public/citation-magnets.json')) as { resources: Array<{ url: string }> };
const trustPanel = read('../components/authority/CitationTrustPanel.tsx');
const collectionRouter = read('../components/authority/CitationCollectionTrustRouter.tsx');
const footer = read('../components/site-footer.tsx');
const raceList = read('../pages/elections/ElectionRaceListPage.tsx');
const candidateList = read('../pages/elections/ElectionCandidateListPage.tsx');
const pollList = read('../pages/elections/ElectionPollListPage.tsx');
const resultsList = read('../pages/elections/ElectionResultsListPage.tsx');
const legislatureIndex = read('../routes/texas-legislature.index.tsx');

const manifestPaths = new Set(manifest.resources.map((resource) => new URL(resource.url).pathname));

describe('citation trust coverage', () => {
  it('keeps the standard visible trust labels', () => {
    expect(trustPanel).toContain('>Sources<');
    expect(trustPanel).toContain('>Methodology<');
    expect(trustPanel).toContain('>Last verified<');
  });

  it('keeps record-derived trust on promoted election collection directories', () => {
    expect(manifestPaths.has('/elections/races')).toBe(true);
    expect(manifestPaths.has('/elections/candidates')).toBe(true);
    expect(manifestPaths.has('/elections/polls')).toBe(true);
    expect(manifestPaths.has('/elections/results')).toBe(true);
    expect(raceList).toContain('<ElectionDirectoryTrustPanel kind="races" />');
    expect(candidateList).toContain('<ElectionDirectoryTrustPanel kind="candidates" />');
    expect(pollList).toContain('<ElectionDirectoryTrustPanel kind="polls" />');
    expect(resultsList).toContain('<ElectionDirectoryTrustPanel kind="results" />');
  });

  it('keeps trust coverage on broad promoted collections', () => {
    for (const path of ['/bills', '/laws', '/representatives', '/texas-legislature/committees', '/citation-guide']) {
      expect(manifestPaths.has(path)).toBe(true);
      expect(collectionRouter).toContain(`'${path}'`);
    }
    expect(footer).toContain('<CitationCollectionTrustRouter />');
  });

  it('keeps the Legislature hub trust layer attached to the canonical hub route', () => {
    expect(manifestPaths.has('/texas-legislature')).toBe(true);
    expect(legislatureIndex).toContain('<LegislatureHubTrustPanel />');
  });

  it('uses underlying record dates for election-directory freshness when available', () => {
    const directoryTrust = read('../components/elections/ElectionDirectoryTrustPanel.tsx');
    expect(directoryTrust).toContain('record.verifiedAt');
    expect(directoryTrust).toContain('record.updatedAt');
    expect(directoryTrust).toContain('record.dataAsOf');
    expect(directoryTrust).toContain('Individual record dates control');
  });
});
