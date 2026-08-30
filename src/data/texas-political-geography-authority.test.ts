import { describe, expect, it } from "vitest";
import { TEXAS_POLITICAL_GEOGRAPHY_AUTHORITY_PAGES } from "./texas-political-geography-authority";

const allowedHosts = new Set([
  "www.sos.state.tx.us",
  "texaspolitics.utexas.edu",
  "www.tshaonline.org",
  "www.tsl.texas.gov",
]);

function words(page: (typeof TEXAS_POLITICAL_GEOGRAPHY_AUTHORITY_PAGES)[number]) {
  return [
    page.title,
    page.description,
    page.intro,
    page.shortAnswer,
    ...page.timeline.flatMap((item) => [item.event, item.meaning]),
    ...page.sections.flatMap((section) => [section.heading, ...section.paragraphs]),
    ...page.faqs.flatMap((faq) => [faq.question, faq.answer]),
  ].join(" ").trim().split(/\s+/).filter(Boolean).length;
}

describe("Texas political geography authority", () => {
  it("publishes exactly four substantive, sourced geography authorities", () => {
    expect(TEXAS_POLITICAL_GEOGRAPHY_AUTHORITY_PAGES).toHaveLength(4);
    for (const page of TEXAS_POLITICAL_GEOGRAPHY_AUTHORITY_PAGES) {
      expect(page.timeline.length, page.slug).toBeGreaterThanOrEqual(8);
      expect(page.sections.length, page.slug).toBeGreaterThanOrEqual(6);
      expect(page.sources.length, page.slug).toBeGreaterThanOrEqual(5);
      expect(page.relatedLinks.length, page.slug).toBeGreaterThanOrEqual(5);
      expect(page.faqs.length, page.slug).toBeGreaterThanOrEqual(3);
      expect(words(page), page.slug).toBeGreaterThanOrEqual(850);
      for (const source of page.sources) {
        expect(allowedHosts.has(new URL(source.href).hostname), `${page.slug}: ${source.href}`).toBe(true);
      }
      expect(page.relatedLinks.some((link) => link.href === "/texas-politics" || link.href.startsWith("/texas-politics/")), page.slug).toBe(true);
    }
  });

  it("uses unique slugs, titles and descriptions", () => {
    const slugs = TEXAS_POLITICAL_GEOGRAPHY_AUTHORITY_PAGES.map((page) => page.slug);
    const titles = TEXAS_POLITICAL_GEOGRAPHY_AUTHORITY_PAGES.map((page) => page.seoTitle);
    const descriptions = TEXAS_POLITICAL_GEOGRAPHY_AUTHORITY_PAGES.map((page) => page.description);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });
});
