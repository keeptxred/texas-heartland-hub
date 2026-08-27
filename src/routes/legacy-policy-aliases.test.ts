import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const CASES = [
  ["politics.tsx", "/politics", "/texas-politics"],
  ["laws.texas-gun-laws.tsx", "/laws/texas-gun-laws", "/news/texas-gun-laws-explained"],
  ["laws.texas-property-tax-laws.tsx", "/laws/texas-property-tax-laws", "/news/texas-property-tax-laws-explained"],
  ["laws.texas-election-laws.tsx", "/laws/texas-election-laws", "/news/texas-election-laws-explained"],
  ["texas-energy-policy.tsx", "/texas-energy-policy", "/texas-energy"],
  ["ercot-texas-power-grid.tsx", "/ercot-texas-power-grid", "/issues/ercot-grid-reliability"],
  ["texas-water.tsx", "/texas-water", "/issues/texas-water-policy"],
] as const;

describe("legacy policy and law aliases", () => {
  it.each(CASES)("preserves %s as a permanent canonical redirect", (file, legacyPath, targetPath) => {
    const source = readFileSync(resolve(HERE, file), "utf8");
    expect(source).toContain(`createFileRoute(\"${legacyPath}\")`);
    expect(source).toContain(targetPath);
    expect(source).toContain("statusCode: 301");
    expect(source).toContain("location.searchStr");
  });
});
