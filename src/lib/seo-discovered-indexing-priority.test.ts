import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { MIN_AUTHOR_ARTICLES_FOR_INDEXING } from "@/lib/author-indexability";

const read = (path: string) => readFileSync(path, "utf8");

describe("discovered-not-indexed crawl priority", () => {
  it("keeps election detail inventory out of the priority sitemap during recovery", () => {
    const source = read("src/routes/sitemap-elections[.]xml.ts");
    expect(source).toContain("PRIORITY_ELECTION_PATHS");
    expect(source).toContain('"/elections/2026"');
    expect(source).toContain('"/elections/races"');
    expect(source).toContain('"/elections/candidates"');
    expect(source).toContain('"/elections/polls"');
    expect(source).not.toContain('candidates.json');
    expect(source).not.toContain('races.json');
    expect(source).not.toContain('polls.json');
    expect(source).not.toContain('forecasts.json');
    expect(source).not.toContain('results.json');
    expect(source).not.toContain('/elections/candidates/${');
    expect(source).not.toContain('/elections/races/${');
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
    expect(source).toContain("MIN_BILLS_PER_SITEMAP_SUBJECT = 3");
    expect(source).toContain("isSitemapWorthySubjectSlug");
    expect(source).toContain("taxonomyCodeCount <= 1");
    expect(source).toContain("approvedSubjectBillCounts.get(subject.id)");
  });
});
