import { describe, expect, it } from "vitest";
import { TEXAS_MUNICIPAL_GOVERNMENT_AUTHORITY_PAGES } from "./texas-municipal-government-authority";

const AUTHORITATIVE_SOURCE_HOSTS = new Set([
  "statutes.capitol.texas.gov",
  "www.sos.state.tx.us",
  "www.tshaonline.org",
  "www.tml.org",
  "www.txcourts.gov",
]);

function pageWordCount(page: (typeof TEXAS_MUNICIPAL_GOVERNMENT_AUTHORITY_PAGES)[number]) {
  return [
    page.title,
    page.intro,
    page.shortAnswer,
    ...page.timeline.flatMap((item) => [item.event, item.meaning]),
    ...page.sections.flatMap((section) => [section.heading, ...section.paragraphs]),
    ...page.faqs.flatMap((faq) => [faq.question, faq.answer]),
  ].join(" ").trim().split(/\s+/).filter(Boolean).length;
}

describe("Texas municipal government authority pages", () => {
  it("keeps every published municipal-government page substantive", () => {
    expect(TEXAS_MUNICIPAL_GOVERNMENT_AUTHORITY_PAGES.length).toBe(8);
    for (const page of TEXAS_MUNICIPAL_GOVERNMENT_AUTHORITY_PAGES) {
      expect(page.timeline.length, page.slug).toBeGreaterThanOrEqual(8);
      expect(page.sections.length, page.slug).toBeGreaterThanOrEqual(5);
      expect(page.faqs.length, page.slug).toBeGreaterThanOrEqual(3);
      expect(page.sources.length, page.slug).toBeGreaterThanOrEqual(5);
      expect(page.relatedLinks.length, page.slug).toBeGreaterThanOrEqual(5);
      expect(pageWordCount(page), page.slug).toBeGreaterThanOrEqual(850);
    }
  });

  it("uses authoritative state, municipal-association, judicial or archival source families", () => {
    for (const page of TEXAS_MUNICIPAL_GOVERNMENT_AUTHORITY_PAGES) {
      for (const source of page.sources) {
        const host = new URL(source.href).hostname;
        expect(AUTHORITATIVE_SOURCE_HOSTS.has(host), `${page.slug}: ${host}`).toBe(true);
      }
    }
  });

  it("connects municipal history to the existing local-government handbook and elections", () => {
    for (const page of TEXAS_MUNICIPAL_GOVERNMENT_AUTHORITY_PAGES) {
      const hrefs = new Set(page.relatedLinks.map((link) => link.href));
      expect(hrefs.has("/issues/texas-local-government-handbook"), page.slug).toBe(true);
      expect(hrefs.has("/elections/2026"), page.slug).toBe(true);
    }
  });

  it("uses unique slugs, titles and descriptions", () => {
    const slugs = TEXAS_MUNICIPAL_GOVERNMENT_AUTHORITY_PAGES.map((page) => page.slug);
    const titles = TEXAS_MUNICIPAL_GOVERNMENT_AUTHORITY_PAGES.map((page) => page.seoTitle);
    const descriptions = TEXAS_MUNICIPAL_GOVERNMENT_AUTHORITY_PAGES.map((page) => page.description);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });
});
