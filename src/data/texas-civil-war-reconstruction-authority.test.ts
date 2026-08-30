import { describe, expect, it } from "vitest";
import { TEXAS_CIVIL_WAR_RECONSTRUCTION_AUTHORITY_PAGES } from "./texas-civil-war-reconstruction-authority";

const AUTHORITATIVE_SOURCE_HOSTS = new Set(["www.tshaonline.org", "www.tsl.texas.gov"]);

function pageWordCount(page: (typeof TEXAS_CIVIL_WAR_RECONSTRUCTION_AUTHORITY_PAGES)[number]) {
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

describe("Texas Civil War and Reconstruction authority pages", () => {
  it("publishes the complete secession-to-1876 bridge cluster", () => {
    expect(TEXAS_CIVIL_WAR_RECONSTRUCTION_AUTHORITY_PAGES).toHaveLength(7);
  });

  it("keeps every published page substantive", () => {
    for (const page of TEXAS_CIVIL_WAR_RECONSTRUCTION_AUTHORITY_PAGES) {
      expect(page.timeline.length, page.slug).toBeGreaterThanOrEqual(8);
      expect(page.sections.length, page.slug).toBeGreaterThanOrEqual(5);
      expect(page.faqs.length, page.slug).toBeGreaterThanOrEqual(3);
      expect(page.sources.length, page.slug).toBeGreaterThanOrEqual(5);
      expect(page.relatedLinks.length, page.slug).toBeGreaterThanOrEqual(5);
      expect(pageWordCount(page), page.slug).toBeGreaterThanOrEqual(850);
    }
  });

  it("uses authoritative Texas archival and historical source families", () => {
    for (const page of TEXAS_CIVIL_WAR_RECONSTRUCTION_AUTHORITY_PAGES) {
      for (const source of page.sources) {
        const host = new URL(source.href).hostname;
        expect(AUTHORITATIVE_SOURCE_HOSTS.has(host), `${page.slug}: ${host}`).toBe(true);
      }
    }
  });

  it("connects every page into the constitutional and government authority graph", () => {
    for (const page of TEXAS_CIVIL_WAR_RECONSTRUCTION_AUTHORITY_PAGES) {
      const hrefs = page.relatedLinks.map((link) => link.href);
      expect(hrefs.some((href) => href.startsWith("/texas-politics/") || href.startsWith("/texas-government")), page.slug).toBe(true);
    }
  });

  it("uses unique slugs, titles and descriptions", () => {
    const slugs = TEXAS_CIVIL_WAR_RECONSTRUCTION_AUTHORITY_PAGES.map((page) => page.slug);
    const titles = TEXAS_CIVIL_WAR_RECONSTRUCTION_AUTHORITY_PAGES.map((page) => page.seoTitle);
    const descriptions = TEXAS_CIVIL_WAR_RECONSTRUCTION_AUTHORITY_PAGES.map((page) => page.description);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });
});
