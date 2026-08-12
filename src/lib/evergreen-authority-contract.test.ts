import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');
const component = read('../components/authority/EvergreenAuthorityReference.tsx');

const pillars = [
  { path: '../routes/texas-energy.tsx', markers: ['Who controls what in Texas energy', 'ERCOT', 'Public Utility Commission of Texas', 'Railroad Commission of Texas'] },
  { path: '../routes/texas-border-security.tsx', markers: ['Texas, federal and military roles at the border', 'Texas Department of Public Safety', 'Texas Military Department', 'U.S. Customs and Border Protection'] },
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
