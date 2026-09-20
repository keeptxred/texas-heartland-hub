import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("../routes/glossary.tsx", import.meta.url), "utf8");

const officialSourceMarkers = [
  "TLC_GLOSSARY",
  "LRL_SESSIONS",
  "COMPTROLLER_PROPERTY_TAX",
  "COMPTROLLER_EXEMPTIONS",
  "TEA_SCHOOL_FINANCE",
];

describe("Texas political glossary provenance", () => {
  it("keeps official source families attached to the glossary", () => {
    for (const marker of officialSourceMarkers) expect(source).toContain(marker);
    expect(source).toContain("CitationTrustPanel");
    expect(source).toContain('lastVerified="August 20, 2026"');
    expect(source).toContain("isBasedOn");
  });

  it("preserves the current school-district homestead exemption amount", () => {
    expect(source).toContain("$140,000");
  });

  it("warns readers that shorthand definitions do not replace controlling law", () => {
    expect(source).toContain("not substitutes for the governing statute");
    expect(source).toContain("statutory exceptions");
  });
});
