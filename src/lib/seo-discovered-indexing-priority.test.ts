import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { MIN_AUTHOR_ARTICLES_FOR_INDEXING } from "@/lib/author-indexability";

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
    expect(MIN_AUTHOR_ARTICLES_FOR_INDEXING).toBe(3);
    expect(source).toContain("hasEnoughAuthorArticles");
    expect(source).toContain("records.map((record) => record.slug)");
  });

  it("requires bill and subject substance before sitemap inclusion", () => {
    const source = read("src/lib/legislative-sitemaps.ts");
    expect(source).toContain("isSitemapWorthyBill");
    expect(source).toContain("const minimumScore = SIMPLE_RESOLUTION_TYPES.has(billType) ? 4 : 2");
    expect(source).toContain("isSitemapWorthySubjectSlug");
    expect(source).toContain("taxonomyCodeCount <= 1");
  });
});
