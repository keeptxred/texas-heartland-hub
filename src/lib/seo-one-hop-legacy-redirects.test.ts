import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync("src/start.ts", "utf8");

describe("legacy redirect chains", () => {
  it("keeps the Search Console external legacy mappings explicit", () => {
    const expected = [
      '["/tax-calculator", "https://texasdefined.com/decide/property-taxes"]',
      '["/texas-property-tax-protest-guide", "https://texasdefined.com/do/property-tax-protest"]',
      '["/texas-financial-tools", "https://texasdefined.com/decide/financial-tools"]',
      '["/living-in-texas", "https://texasdefined.com/texas-living"]',
    ];

    for (const mapping of expected) expect(source).toContain(mapping);
  });

  it("resolves external legacy destinations before KTR host/protocol normalization", () => {
    const externalLookup = source.indexOf("const externalTarget = EXTERNAL_LEGACY_REDIRECTS.get");
    const externalReturn = source.indexOf("location: finalUrl.toString()", externalLookup);
    const hostNormalization = source.indexOf('const hostChanged = requestHost !== "keeptxred.com"', externalLookup);
    const protocolNormalization = source.indexOf('const protocolChanged = requestProto !== "https"', externalLookup);

    expect(externalLookup).toBeGreaterThan(-1);
    expect(externalReturn).toBeGreaterThan(externalLookup);
    expect(hostNormalization).toBeGreaterThan(externalReturn);
    expect(protocolNormalization).toBeGreaterThan(externalReturn);
  });

  it("keeps external migrations permanent and preserves non-tracking query state", () => {
    const externalLookup = source.indexOf("const externalTarget = EXTERNAL_LEGACY_REDIRECTS.get");
    const hostNormalization = source.indexOf('const hostChanged = requestHost !== "keeptxred.com"', externalLookup);
    const block = source.slice(externalLookup, hostNormalization);

    expect(block).toContain("target.searchParams.forEach");
    expect(block).toContain("status: 301");
    expect(block).toContain('"cache-control": "public, max-age=86400"');
  });
});
