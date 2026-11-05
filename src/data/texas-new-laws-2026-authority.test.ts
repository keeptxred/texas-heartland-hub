import { describe, expect, it } from "vitest";
import { ARTICLE_BODIES } from "./article-bodies";
import { ARTICLES } from "./articles";

const slug = "texas-new-laws-2026";
const sourceUrls = [
  "https://capitol.texas.gov/tlodocs/89R/billtext/html/SJ00002F.htm",
  "https://capitol.texas.gov/tlodocs/89R/billtext/html/SB00004F.htm",
  "https://capitol.texas.gov/tlodocs/89R/billtext/html/HB00149F.htm",
  "https://capitol.texas.gov/tlodocs/89R/billtext/html/HB00022F.htm",
  "https://capitol.texas.gov/billlookup/BillSummary.aspx?Bill=SB2&LegSess=89R",
  "https://educationfreedom.texas.gov/families/",
  "https://www.dps.texas.gov/section/vehicle-inspection/faq/bexar-county-emission-inspections",
];

describe("Texas new laws 2026 authority guide", () => {
  const body = ARTICLE_BODIES[slug];
  const article = ARTICLES.find((a) => a.slug === slug);
  const paragraphs = [...body.intro, ...body.sections.flatMap((section) => section.paragraphs ?? [])];
  const prose = [...paragraphs, ...body.keyTakeaways ?? [], ...body.faq.map(({ a }) => a)].join(" ");

  it("preserves original publication while dating only the substantive correction", () => {
    expect(article?.publishedAt).toBe("2026-07-15T10:30:00");
    expect(article?.dateModified).toBe("2026-11-05");
    expect(article?.lastReviewedDate).toBe("2026-11-05");
    expect(body.updated).toBe("2026-11-05");
    expect(article?.dek).toContain("primary-source");
  });

  it("does not misdate the homestead exemption or confuse 2025 and 2026", () => {
    expect(prose).toContain("January 1, 2025");
    expect(prose).toContain("not first with tax year 2026");
    expect(prose).not.toContain("The single largest change taking effect for the 2026 tax year");
    expect(prose).not.toContain("The homestead exemption rose to $140,000 for the 2026 tax year");
  });

  it("names verified 2026 effective dates and avoids unsupported sweeping generalizations", () => {
    expect(prose).toContain("House Bill 149");
    expect(prose).toContain("House Bill 22");
    expect(prose).toContain("January 1, 2026");
    expect(prose).toContain("November 1, 2026");
    expect(prose).toContain("September 1, 2025");
    expect(prose).not.toContain("Operation Lone Star funding continues at record levels");
    expect(prose).not.toContain("None of these was seriously considered in either chamber");
  });

  it("has substantive analysis and item-specific government links", () => {
    expect(paragraphs.join(" ").trim().split(/\s+/).length).toBeGreaterThanOrEqual(1300);
    for (const url of sourceUrls) {
      expect(body.sources.some((source) => source.url === url)).toBe(true);
      expect(prose).toContain(url);
    }
    expect(body.sections.length).toBeGreaterThanOrEqual(7);
    expect(body.faq.length).toBeGreaterThanOrEqual(5);
  });
});
