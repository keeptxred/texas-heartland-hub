import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const startSource = readFileSync(new URL("../start.ts", import.meta.url), "utf8");
const propertyTaxAlias = readFileSync(new URL("./texas.property-taxes-2026.tsx", import.meta.url), "utf8");

describe("legacy redirect chain contract", () => {
  it("sends the oldest property-tax alias directly to the final canonical guide", () => {
    expect(startSource).toContain('["/property-taxes", "/news/texas-property-tax-guide"]');
    expect(startSource).not.toContain('["/property-taxes", "/texas/property-taxes-2026"]');
    expect(propertyTaxAlias).toContain('/news/texas-property-tax-guide');
    expect(propertyTaxAlias).toContain('statusCode: 301');
  });
});
