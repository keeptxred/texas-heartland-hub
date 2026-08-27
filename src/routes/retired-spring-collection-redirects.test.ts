import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const CASES = [
  ["explore.spring-fed-swimming.tsx", "/explore/spring-fed-swimming"],
  ["explore.hill-country-springs.tsx", "/explore/hill-country-springs"],
  ["explore.spring-conservation-and-education.tsx", "/explore/spring-conservation-and-education"],
] as const;

describe("retired KeepTXRed spring collection routes", () => {
  it.each(CASES)("routes %s directly to the same TexasDefined path", (file, routePath) => {
    const source = readFileSync(resolve(HERE, file), "utf8");
    expect(source).toContain(`createFileRoute(\"${routePath}\")`);
    expect(source).toContain("https://texasdefined.com${location.pathname}${location.searchStr || \"\"}");
    expect(source).toContain("statusCode: 301");
    expect(source).not.toContain("buildSeo");
    expect(source).not.toContain("SpringCollectionLanding");
  });

  it("keeps the remaining KTR-only spring collection from hopping through retired KTR Explore tools", () => {
    const source = readFileSync(resolve(HERE, "../components/explore/SpringCollectionLanding.tsx"), "utf8");
    expect(source).toContain("https://texasdefined.com/explore");
    expect(source).toContain("https://texasdefined.com/explore/search?q=Texas%20springs");
    expect(source).toContain("https://texasdefined.com/explore/trip-planner");
    expect(source).not.toContain('to="/explore"');
    expect(source).not.toContain('to="/explore/search"');
    expect(source).not.toContain('to="/explore/trip-planner"');
  });
});
