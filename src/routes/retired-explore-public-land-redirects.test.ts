import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const CASES = [
  ["explore.state-parks.tsx", "/explore/state-parks"],
  ["explore.national-wildlife-refuges.tsx", "/explore/national-wildlife-refuges"],
  ["explore.wildlife-management-areas.tsx", "/explore/wildlife-management-areas"],
] as const;

describe("retired KeepTXRed public-land Explore aliases", () => {
  it.each(CASES)("redirects %s directly to TexasDefined", (file, route) => {
    const source = readFileSync(new URL(`./${file}`, import.meta.url), "utf8");
    expect(source).toContain(`createFileRoute(\"${route}\")`);
    expect(source).toContain(`https://texasdefined.com${route}`);
    expect(source).toContain("statusCode: 301");
    expect(source).toContain("location.searchStr");
    expect(source).not.toContain('to: "/explore/search"');
  });
});
