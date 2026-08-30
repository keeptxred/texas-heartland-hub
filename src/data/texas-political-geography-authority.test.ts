import { describe, expect, it } from "vitest";
import { TEXAS_POLITICAL_GEOGRAPHY_AUTHORITY_PAGES } from "./texas-political-geography-authority";

const allowedHosts = new Set([
  "elections.sos.state.tx.us",
  "texaspolitics.utexas.edu",
  "www.sos.state.tx.us",
  "www.tshaonline.org",
  "www.tsl.texas.gov",
]);

function words(page: (typeof TEXAS_POLITICAL_GEOGRAPHY_AUTHORITY_PAGES)[number]) {
  return [page.title, page.description, page.intro, page.shortAnswer,
    ...page.timeline.flatMap((item) => [item.event, item.meaning]),
    ...page.sections.flatMap((section) => [section.heading, ...section.paragraphs]),
    ...page.faqs.flatMap((faq) => [faq.question, faq.answer]),
  ].join(" ").trim().split(/\s+/).filter(Boolean).length;
}

describe("Texas political geography authority", () => {
  it("keeps all four geography guides substantive, sourced and interconnected", () => {
    expect(TEXAS_POLITICAL_GEOGRAPHY_AUTHORITY_PAGES).toHaveLength(4);
    for (const page of TEXAS_POLITICAL_GEOGRAPHY_AUTHORITY_PAGES) {
      expect(page.timeline.length, page.slug).toBeGreaterThanOrEqual(8);
      expect(page.sections.length, page.slug).toBeGreaterThanOrEqual(5);
      expect(page.sources.length, page.slug).toBeGreaterThanOrEqual(5);
      expect(page.relatedLinks.length, page.slug).toBeGreaterThanOrEqual(5);
      expect(page.faqs.length, page.slug).toBeGreaterThanOrEqual(3);
      expect(words(page), page.slug).toBeGreaterThanOrEqual(850);
      for (const source of page.sources) expect(allowedHosts.has(new URL(source.href).hostname), `${page.slug}: ${source.href}`).toBe(true);
      expect(page.relatedLinks.some((link) => link.href === "/texas-politics/texas-election-history" || link.href === "/texas-politics"), page.slug).toBe(true);
    }
  });

  it("uses unique slugs, SEO titles and descriptions", () => {
    for (const values of [
      TEXAS_POLITICAL_GEOGRAPHY_AUTHORITY_PAGES.map((page) => page.slug),
      TEXAS_POLITICAL_GEOGRAPHY_AUTHORITY_PAGES.map((page) => page.seoTitle),
      TEXAS_POLITICAL_GEOGRAPHY_AUTHORITY_PAGES.map((page) => page.description),
    ]) expect(new Set(values).size).toBe(values.length);
  });
});
