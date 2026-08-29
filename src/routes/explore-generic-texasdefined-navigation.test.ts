import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./explore.$slug.tsx", import.meta.url), "utf8");

describe("generic Explore destination migration navigation", () => {
  it("routes retired Explore navigation directly to TexasDefined", () => {
    expect(source).toContain('const TEXAS_DEFINED_EXPLORE = "https://texasdefined.com/explore"');
    expect(source).toContain('const TEXAS_DEFINED_SEARCH = "https://texasdefined.com/explore/search"');
    expect(source).toContain('const TEXAS_DEFINED_TRIP_PLANNER = "https://texasdefined.com/explore/trip-planner"');
    expect(source).toContain('href={texasDefinedSearchHref({ activities: [activity] })}');
    expect(source).toContain('href={texasDefinedSearchHref({ types: [entity.entityType] })}');
    expect(source).toContain('href={texasDefinedSearchHref()}');
  });

  it("routes county and region navigation to TexasDefined without changing this page canonical", () => {
    expect(source).toContain('return `${TEXAS_DEFINED_ORIGIN}${geographyPath(kind, name)}`');
    expect(source).toContain('url: `https://keeptxred.com/explore/${entity.slug}`');
    expect(source).toContain('item: `https://keeptxred.com/explore/${entity.slug}`');
  });

  it("does not send users through retired KTR Explore navigation routes", () => {
    expect(source).not.toContain('to="/explore"');
    expect(source).not.toContain('to="/explore/search"');
    expect(source).not.toContain('to="/explore/trip-planner"');
    expect(source).not.toContain('https://keeptxred.com/explore/search');
  });
});
