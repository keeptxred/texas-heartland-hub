import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const startSource = readFileSync(new URL("../start.ts", import.meta.url), "utf8");
const propertyTaxAlias = readFileSync(new URL("./texas.property-taxes-2026.tsx", import.meta.url), "utf8");

const TEXASDEFINED_PROPERTY_TAX_GUIDE = "https://texasdefined.com/learn/property-taxes";

describe("legacy redirect chain contract", () => {
  it("sends property-tax aliases directly to the final TexasDefined guide", () => {
    expect(startSource).toContain(`[\"/property-taxes\", \"${TEXASDEFINED_PROPERTY_TAX_GUIDE}\"]`);
    expect(startSource).toContain(`[\"/texas/property-taxes-2026\", \"${TEXASDEFINED_PROPERTY_TAX_GUIDE}\"]`);
    expect(startSource).toContain(`[\"/news/texas-property-tax-guide\", \"${TEXASDEFINED_PROPERTY_TAX_GUIDE}\"]`);
    expect(startSource).not.toContain('["/property-taxes", "/news/texas-property-tax-guide"]');
    expect(startSource).not.toContain('["/property-taxes", "/texas/property-taxes-2026"]');
    expect(propertyTaxAlias).toContain(TEXASDEFINED_PROPERTY_TAX_GUIDE);
    expect(propertyTaxAlias).toContain("statusCode: 301");
  });
});