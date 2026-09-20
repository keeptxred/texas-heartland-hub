import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./explore.$slug.tsx", import.meta.url), "utf8");

describe("retired generic Explore destination route", () => {
  it("redirects each destination slug to the same TexasDefined path", () => {
    expect(source).toContain('createFileRoute("/explore/$slug")');
    expect(source).toContain("https://texasdefined.com/explore/${encodeURIComponent(params.slug)}");
    expect(source).toContain("statusCode: 301");
    expect(source).toContain("location.searchStr");
  });

  it("does not retain KTR lifestyle rendering or canonical ownership", () => {
    expect(source).not.toContain("buildSeo");
    expect(source).not.toContain("getExploreEntity");
    expect(source).not.toContain("EntityGrid");
    expect(source).not.toContain("ExploreMap");
    expect(source).not.toContain("https://keeptxred.com/explore");
  });
});
