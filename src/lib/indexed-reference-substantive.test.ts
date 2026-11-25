import { describe, expect, it } from "vitest";
import { ARTICLE_BODIES } from "@/data/article-bodies";
import { ARTICLES } from "@/data/articles";
import { isStaticArticleIndexable } from "@/lib/static-article-indexability";

const slugs = ["texas-open-meetings-public-info", "texas-water-rights-explained", "school-choice-esa-guide", "texas-grid-ercot-explained"];
describe("November 25 civic and policy authority revisions", () => {
  it.each(slugs)("preserves original indexable article and substantive source-backed review for %s", slug => {
    const body = ARTICLE_BODIES[slug];
    const article = ARTICLES.find(item => item.slug === slug);
    expect(article).toBeDefined();
    expect(isStaticArticleIndexable(article!)).toBe(true);
    expect(body.updated).toBe("2026-11-25");
    expect(body.sources.length).toBeGreaterThanOrEqual(5);
    expect(body.sections.length).toBeGreaterThanOrEqual(6);
    expect(body.faq.length).toBeGreaterThanOrEqual(5);
  });
  it("distinguishes meeting notice, open final action, and public-record production", () => {
    const body = JSON.stringify(ARTICLE_BODIES["texas-open-meetings-public-info"]);
    expect(body).toContain("three business days");
    expect(body).toContain("September 1, 2025");
    expect(body).toContain("§551.102");
    expect(body).toContain("§552.221");
    expect(body).toContain("§552.301");
    expect(body).not.toContain("Written notice posted at least 72 hours");
    expect(body).not.toContain("has 10 business days to produce records");
  });
  it("qualifies groundwater ownership and exemption", () => {
    const body = JSON.stringify(ARTICLE_BODIES["texas-water-rights-explained"]);
    expect(body).toContain("larger than ten acres");
    expect(body).toContain("25,000 gallons a day");
    expect(body).toContain("does not establish an unconditional right");
    expect(body).toContain("registration");
  });
  it("distinguishes the closed application window and award categories", () => {
    const body = JSON.stringify(ARTICLE_BODIES["school-choice-esa-guide"]);
    expect(body).toContain("2026–27 school year are closed");
    expect(body).toContain("2027–28 interest list");
    expect(body).toContain("$10,474");
    expect(body).toContain("$2,000");
    expect(body).toContain("$30,000");
    expect(body).toContain("10%");
    expect(body).not.toContain("zoned to underperforming campuses");
  });
  it("distinguishes ERCOT wholesale jurisdiction from reliability and retail bills", () => {
    const body = JSON.stringify(ARTICLE_BODIES["texas-grid-ercot-explained"]);
    expect(body).toContain("sections 203, 205 and 206");
    expect(body).toContain("applicable NERC standards");
    expect(body).toContain("200 MWh");
    expect(body).not.toContain("Objectively yes");
    expect(body).not.toContain("federal integration would not have prevented");
  });
});
