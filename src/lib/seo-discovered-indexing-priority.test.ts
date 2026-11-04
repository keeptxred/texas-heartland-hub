import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { MIN_AUTHOR_ARTICLES_FOR_INDEXING } from "@/lib/author-indexability";

const read = (path: string) => readFileSync(path, "utf8");

describe("discovered-not-indexed crawl priority", () => {
  it("withdraws the retired election inventory from the public sitemap", () => {
    const electionFeed = read("src/routes/sitemap-elections[.]xml.ts");
    const sitemapIndex = read("src/routes/sitemap[.]xml.ts");
    const shared = read("src/lib/sitemap-shared.ts");
    expect(electionFeed).toContain("ELECTION_FEATURE_FLAGS.homepagePromotion ? PRIORITY_ELECTION_PATHS : []");
    expect(sitemapIndex).toContain('ELECTION_FEATURE_FLAGS.homepagePromotion ? ["sitemap-elections.xml"] : []');
    expect(shared).toContain('"/elections"');
  });

  it("requires sustained author activity before sitemap inclusion", () => {
    const source = read("src/routes/sitemap-authors[.]xml.ts");
    expect(MIN_AUTHOR_ARTICLES_FOR_INDEXING).toBe(3);
    expect(source).toContain("hasEnoughAuthorArticles");
    expect(source).toContain("records.map((record) => record.slug)");
  });

  it("retires individual bill and subject sitemap entries while keeping the searchable hub", () => {
    const source = read("src/lib/legislative-sitemaps.ts");
    expect(source).toContain("return [{ loc: absUrl('/bills') }]");
    expect(source).not.toContain("isSitemapWorthyBill");
    expect(source).not.toContain("MIN_BILLS_PER_SITEMAP_SUBJECT");
    expect(source).not.toContain("hierarchyEntries");
  });
});
