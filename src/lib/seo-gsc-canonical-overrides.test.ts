import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(path, "utf8");
}

describe("GSC canonical override regressions", () => {
  it("keeps important indexable pages self-canonical", () => {
    const expected = [
      ["src/routes/houston.tsx", "https://keeptxred.com/houston"],
      ["src/routes/register-to-vote.tsx", "https://keeptxred.com/register-to-vote"],
      ["src/routes/authors.index.tsx", "https://keeptxred.com/authors"],
      ["src/routes/keep-texas-red.tsx", "https://keeptxred.com/keep-texas-red"],
    ] as const;

    for (const [file, canonical] of expected) {
      expect(source(file), `${file} must declare ${canonical}`).toContain(canonical);
    }
  });

  it("does not let the Houston canonical page regress into a lifestyle moving guide", () => {
    const houston = source("src/routes/houston.tsx");
    expect(houston).toContain("Houston News, Politics & Business");
    expect(houston).not.toContain("Moving to Houston Guide");
    expect(houston).not.toContain("Plan a move to Houston");
  });

  it("keeps known duplicate routes as explicit permanent redirects", () => {
    const texasNews = source("src/routes/texas-news.tsx");
    expect(texasNews).toContain('href: `/news${location.searchStr || ""}`');
    expect(texasNews).toContain("statusCode: 301");

    const nonPolitical = source("src/routes/news.non-political.tsx");
    expect(nonPolitical).toContain("https://texasdefined.com/texas-living");
    expect(nonPolitical).toContain("statusCode: 301");

    const terms = source("src/routes/terms.tsx");
    expect(terms).toContain('href: "/terms-of-service"');
    expect(terms).toContain("statusCode: 301");
  });

  it("keeps redirect aliases out of the page sitemap", () => {
    const sitemap = source("src/routes/sitemap-pages[.]xml.ts");
    const staticPaths = sitemap.slice(sitemap.indexOf("const STATIC_PATHS"));
    expect(staticPaths).not.toMatch(/["']\/texas-news["']/);
    expect(staticPaths).not.toMatch(/["']\/elections["']/);
    expect(staticPaths).toContain('"/houston"');
    expect(staticPaths).toContain('"/register-to-vote"');
    expect(staticPaths).toContain('"/authors"');
    expect(staticPaths).toContain('"/keep-texas-red"');
  });

  it("gives the Keep Texas Red brand pillar a sitewide footer authority link", () => {
    const navigation = source("src/lib/site-navigation.ts");
    const footer = source("src/components/site-footer.tsx");
    expect(navigation).toContain('{ to: "/keep-texas-red", label: "What Keep Texas Red Means" }');
    expect(footer).toContain("ABOUT_LINKS.map");
  });
});
