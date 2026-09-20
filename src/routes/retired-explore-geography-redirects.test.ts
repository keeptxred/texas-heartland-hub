import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const CASES = [
  ["explore.region.$region.tsx", "/explore/region/$region"],
  ["explore.county.$county.tsx", "/explore/county/$county"],
] as const;

describe("retired KeepTXRed Explore geography routes", () => {
  it.each(CASES)("routes %s directly to the same TexasDefined path", (file, routePath) => {
    const source = readFileSync(resolve(HERE, file), "utf8");
    expect(source).toContain(`createFileRoute(\"${routePath}\")`);
    expect(source).toContain("https://texasdefined.com${location.pathname}${location.searchStr || \"\"}");
    expect(source).toContain("statusCode: 301");
    expect(source).not.toContain("buildSeo");
    expect(source).not.toContain("GeographyLanding");
    expect(source).not.toContain("CountyAuthorityPage");
  });
});
