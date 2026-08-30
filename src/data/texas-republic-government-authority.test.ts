import { describe, expect, it } from "vitest";
import { TEXAS_REPUBLIC_GOVERNMENT_AUTHORITY_PAGES } from "./texas-republic-government-authority";

const AUTHORITATIVE_SOURCE_HOSTS = new Set([
  "www.tshaonline.org",
  "www.tsl.texas.gov",
]);

function pageWordCount(page: (typeof TEXAS_REPUBLIC_GOVERNMENT_AUTHORITY_PAGES)[number]) {
  const text = [
    page.title,
    page.intro,
    page.shortAnswer,
    ...page.timeline.flatMap((item) => [item.event, item.meaning]),
    ...page.sections.flatMap((section) => [section.heading, ...section.paragraphs]),
    ...page.faqs.flatMap((faq) => [faq.question, faq.answer]),
  ].join(" ");
  return text.trim().split(/\s+/).filter(Boolean).length;
}

describe("Republic of Texas government authority pages", () => {
  it("publishes the complete Republic and state-formation cluster", () => {
    expect(TEXAS_REPUBLIC_GOVERNMENT_AUTHORITY_PAGES).toHaveLength(9);
  });

  it("keeps every published Republic authority page substantive", () => {
    for (const page of TEXAS_REPUBLIC_GOVERNMENT_AUTHORITY_PAGES) {
      expect(page.timeline.length, page.slug).toBeGreaterThanOrEqual(8);
      expect(page.sections.length, page.slug).toBeGreaterThanOrEqual(5);
      expect(page.faqs.length, page.slug).toBeGreaterThanOrEqual(3);
      expect(page.sources.length, page.slug).toBeGreaterThanOrEqual(5);
      expect(page.relatedLinks.length, page.slug).toBeGreaterThanOrEqual(5);
      expect(pageWordCount(page), page.slug).toBeGreaterThanOrEqual(850);
    }
  });

  it("uses authoritative Texas archival and historical source families", () => {
    for (const page of TEXAS_REPUBLIC_GOVERNMENT_AUTHORITY_PAGES) {
      for (const source of page.sources) {
        const host = new URL(source.href).hostname;
        expect(AUTHORITATIVE_SOURCE_HOSTS.has(host), `${page.slug}: ${host}`).toBe(true);
      }
    }
  });

  it("connects every page into the Republic, constitutional or current-government authority graph", () => {
    for (const page of TEXAS_REPUBLIC_GOVERNMENT_AUTHORITY_PAGES) {
      const hrefs = page.relatedLinks.map((link) => link.href);
      expect(
        hrefs.some((href) =>
          href.startsWith("/texas-politics/") ||
          href.startsWith("/texas-government") ||
          href.startsWith("/texas-legislature") ||
          href.startsWith("/laws/"),
        ),
        page.slug,
      ).toBe(true);
    }
  });

  it("uses unique slugs, titles and descriptions", () => {
    const slugs = TEXAS_REPUBLIC_GOVERNMENT_AUTHORITY_PAGES.map((page) => page.slug);
    const titles = TEXAS_REPUBLIC_GOVERNMENT_AUTHORITY_PAGES.map((page) => page.seoTitle);
    const descriptions = TEXAS_REPUBLIC_GOVERNMENT_AUTHORITY_PAGES.map((page) => page.description);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });
});
