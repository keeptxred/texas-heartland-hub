import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(path, "utf8");

describe("discovered-not-indexed crawl priority", () => {
  it("requires candidate substance before sitemap inclusion", () => {
    const source = read("src/routes/sitemap-elections[.]xml.ts");
    expect(source).toContain("isSitemapWorthyCandidate");
    expect(source).toContain("return score >= 3");
    expect(source).toContain("candidates: publicCandidateRecords(candidates)");
    expect(source).toContain('record.publicationStatus === "published"');
    expect(source).toContain('record.verificationStatus === "verified"');
  });

  it("requires sustained author activity before sitemap inclusion", () => {
    const source = read("src/routes/sitemap-authors[.]xml.ts");
    expect(source).toContain("MIN_AUTHOR_ARTICLES_FOR_SITEMAP = 3");
    expect(source).toContain("dates.length < MIN_AUTHOR_ARTICLES_FOR_SITEMAP");
  });

  it("keeps bill sitemap quality scoring in place", () => {
    const source = read("src/lib/legislative-sitemaps.ts");
    expect(source).toContain("isSitemapWorthyBill");
    expect(source).toContain("const minimumScore = SIMPLE_RESOLUTION_TYPES.has(billType) ? 4 : 2");
  });
});
