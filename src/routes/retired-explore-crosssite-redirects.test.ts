import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const CASES = [
  ["explore.index.tsx", "/explore/", "https://texasdefined.com/explore"],
  ["explore.caverns.tsx", "/explore/caverns", "https://texasdefined.com/explore/caverns"],
  ["explore.lighthouses.tsx", "/explore/lighthouses", "https://texasdefined.com/explore/lighthouses"],
  ["explore.national-parks.tsx", "/explore/national-parks", "https://texasdefined.com/explore/national-parks"],
  ["explore.historic-sites.tsx", "/explore/historic-sites", "https://texasdefined.com/explore/historic-sites"],
] as const;

describe("retired KeepTXRed Explore routes", () => {
  it.each(CASES)("redirects %s permanently to its TexasDefined owner", (file, route, target) => {
    const source = readFileSync(new URL(`./${file}`, import.meta.url), "utf8");
    expect(source).toContain(`createFileRoute(\"${route}\")`);
    expect(source).toContain(target);
    expect(source).toContain("statusCode: 301");
    expect(source).toContain("location.searchStr");
    expect(source).not.toContain("buildSeo");
  });
});
