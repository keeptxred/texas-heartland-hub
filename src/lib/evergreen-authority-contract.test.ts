import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');
const component = read('../components/authority/EvergreenAuthorityReference.tsx');

const pillars = [
  { path: '../routes/texas-energy.tsx', markers: ['Who controls what in Texas energy', 'ERCOT', 'Public Utility Commission of Texas', 'Railroad Commission of Texas'] },
  { path: '../routes/texas-agriculture.tsx', markers: ['Who governs Texas agriculture, land and rural policy', 'Texas Department of Agriculture', 'Texas Water Development Board', 'U.S. Department of Agriculture'] },
  { path: '../routes/texas-veterans.tsx', markers: ['State, federal and military roles for Texas veterans', 'Texas Veterans Commission', 'U.S. Department of Veterans Affairs', 'Texas Military Department'] },
  { path: '../routes/texas-law-enforcement.tsx', markers: ['DPS, Rangers, TCOLE and local law enforcement', 'Texas Highway Patrol', 'Texas Rangers', 'Texas Commission on Law Enforcement'] },
] as const;

describe('evergreen authority references', () => {
  it('keeps the reusable source, methodology and verification layer', () => {
    expect(component).toContain('CitationTrustPanel');
    expect(component).toContain('Questions this reference answers');
    expect(component).toContain('institutions.map');
    expect(component).toContain('scopeNote');
    expect(component).toContain('lastVerified');
  });

  it('requires the border-security hub to provide documented, testable authority research', () => {
    const route = read('../routes/texas-border-security.tsx');
    const research = read('../components/border-security-authority-research.tsx');
    expect(route).toContain('BorderSecurityAuthorityResearch');
    expect(route).toContain('href: "#border-powers"');
    expect(route).not.toContain('href: "/news/border-security-state-role"');
    expect(research).toContain('BorderSecuritySpendingPanel');
    expect(research).toContain('BORDER_SECURITY_TOTALS');
    expect(research).toContain('borderSecurityFundingChangePercent');
    expect(research).toContain('id="border-powers"');
    expect(research).toContain('id="border-spending"');
    expect(research).toContain('id="border-litigation"');
    expect(research).toContain('id="border-geography"');
    expect(research).toContain('id="border-records"');
    expect(research).toContain('aria-label');
    expect(research).toContain('scope="col"');
    expect(research).toContain('scope="row"');
    expect(research).toContain('Current-status warning');
    expect(research).toContain('not a real-time declaration of enforceability');
    expect(research).toContain('Method:');
    expect(research).toContain('editorial desk');
    for (const officialRecord of [
      'General_Appropriations_Act_2026_2027.pdf',
      'SB00004F.pdf',
      'USCOURTS-ca5-24-50149',
      '26-50418_documents.pdf',
      'texas-mexico-border-crossings.html',
    ]) expect(research).toContain(officialRecord);
  });

  for (const pillar of pillars) {
    it(`keeps authority depth on ${pillar.path}`, () => {
      const source = read(pillar.path);
      expect(source).toContain('EvergreenAuthorityReference');
      expect(source).toContain('methodology=');
      expect(source).toContain('sources={[');
      expect(source).toContain('questions={[');
      for (const marker of pillar.markers) expect(source).toContain(marker);
    });
  }
});
