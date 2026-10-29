import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { SEARCH_RECOVERY_AUTHORITY_GUIDES, SEARCH_RECOVERY_AUTHORITY_SLUGS } from "@/data/search-recovery-authority";

const allowedPrimaryDomains = [
  "ethics.state.tx.us",
  "www.ethics.state.tx.us",
  "webservices.ethics.state.tx.us",
  "statutes.capitol.texas.gov",
  "capitol.texas.gov",
  "lbb.texas.gov",
  "www.lbb.texas.gov",
  "comptroller.texas.gov",
  "www.sos.state.tx.us",
  "sos.state.tx.us",
  "lrl.texas.gov",
  "www.lrl.texas.gov",
];

function wordCount(guide: (typeof SEARCH_RECOVERY_AUTHORITY_GUIDES)[string]) {
  return [
    guide.title,
    guide.dek,
    ...guide.keyTakeaways,
    ...guide.sections.flatMap((section) => [section.heading, ...section.paragraphs, ...(section.bullets ?? [])]),
    ...guide.faq.flatMap((item) => [item.q, item.a]),
    guide.methodology,
  ].join(" ").split(/\s+/).filter(Boolean).length;
}

describe("KTR search-recovery authority guides", () => {
  it("uses the individual verified date for each public government reference sitemap entry", () => {
    const sitemap = readFileSync("src/routes/sitemap-government[.]xml.ts", "utf8");
    expect(sitemap).toContain("toIsoDate(SEARCH_RECOVERY_AUTHORITY_GUIDES[slug].updated)");
    expect(sitemap).not.toContain('lastmod: "2026-09-28"');
    expect(SEARCH_RECOVERY_AUTHORITY_GUIDES["texas-lobbying-2026"].updated).toBe("2026-10-29");
    for (const [slug, guide] of Object.entries(SEARCH_RECOVERY_AUTHORITY_GUIDES)) {
      expect(guide.updated).toMatch(/^\\d{4}-\\d{2}-\\d{2}$/);
      expect(guide.slug).toBe(slug);
    }
  });

  it("2026 lobbying authority links directly to original registries and does not invent exact amounts", () => {
    const guide = SEARCH_RECOVERY_AUTHORITY_GUIDES["texas-lobbying-2026"];
    const article = [guide.dek, ...guide.sections.flatMap((s) => s.paragraphs)].join(" ");
    expect(article).toContain("1A Smart Start LLC");
    expect(article).toContain("June 7, 2026");
    expect(article).toContain("printed timestamp");
    expect(article.toLowerCase()).toContain("not a complete annual total");
    expect(article).not.toContain("The long-term KTR product");
    expect(guide.sources.some((s) => s.url.endsWith("/2026LobbyGroupByClient.xlsx"))).toBe(true);
    expect(guide.sources.some((s) => s.url.includes("LobbyExpendituresByCategory.pdf"))).toBe(true);
    expect(guide.sources.every((s) => !s.url.includes("webservices.ethics.state.tx.us"))).toBe(true);
  });

  it("ships exactly the eight deliberately selected guides", () => {
    expect(SEARCH_RECOVERY_AUTHORITY_SLUGS).toHaveLength(8);
    expect(new Set(SEARCH_RECOVERY_AUTHORITY_SLUGS).size).toBe(8);
  });

  for (const [slug, guide] of Object.entries(SEARCH_RECOVERY_AUTHORITY_GUIDES)) {
    it(`${slug} clears the authority quality floor`, () => {
      expect(guide.slug).toBe(slug);
      expect(guide.updated).toBe(slug === "texas-lobbying-2026" ? "2026-10-29" : "2026-09-28");
      expect(guide.keyTakeaways.length).toBeGreaterThanOrEqual(5);
      expect(guide.sections.length).toBeGreaterThanOrEqual(5);
      expect(guide.faq.length).toBeGreaterThanOrEqual(4);
      expect(guide.sources.length).toBeGreaterThanOrEqual(3);
      expect(wordCount(guide)).toBeGreaterThanOrEqual(500);
      for (const source of guide.sources) {
        expect(source.url.startsWith("https://")).toBe(true);
        expect(allowedPrimaryDomains).toContain(new URL(source.url).hostname);
      }
    });
  }
});
