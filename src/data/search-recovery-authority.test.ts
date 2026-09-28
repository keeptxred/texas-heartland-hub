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
  it("ships exactly the eight deliberately selected guides", () => {
    expect(SEARCH_RECOVERY_AUTHORITY_SLUGS).toHaveLength(8);
    expect(new Set(SEARCH_RECOVERY_AUTHORITY_SLUGS).size).toBe(8);
  });

  for (const [slug, guide] of Object.entries(SEARCH_RECOVERY_AUTHORITY_GUIDES)) {
    it(`${slug} clears the authority quality floor`, () => {
      expect(guide.slug).toBe(slug);
      expect(guide.updated).toBe("2026-09-28");
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
