import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const CASES = [
  ["explore.search.tsx", "/explore/search"],
  ["explore.trip-planner.tsx", "/explore/trip-planner"],
  ["explore.texas-wildflower-seasons.tsx", "/explore/texas-wildflower-seasons"],
] as const;

describe("retired KeepTXRed Explore tools", () => {
  it.each(CASES)("redirects %s to the same canonical path on TexasDefined", (file, route) => {
    const source = readFileSync(new URL(`./${file}`, import.meta.url), "utf8");
    expect(source).toContain(`createFileRoute(\"${route}\")`);
    expect(source).toContain(`https://texasdefined.com${route}`);
    expect(source).toContain("statusCode: 301");
    expect(source).toContain("location.searchStr");
    expect(source).not.toContain("buildSeo");
  });
});
