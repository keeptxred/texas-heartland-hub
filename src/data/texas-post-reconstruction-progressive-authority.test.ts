import { describe, expect, it } from "vitest";
import { TEXAS_POST_RECONSTRUCTION_PROGRESSIVE_AUTHORITY_PAGES } from "./texas-post-reconstruction-progressive-authority";

const AUTHORITATIVE_SOURCE_HOSTS = new Set([
  "www.tshaonline.org",
  "www.tsl.texas.gov",
  "www.lrl.texas.gov",
  "www.rrc.texas.gov",
]);

function pageWordCount(page: (typeof TEXAS_POST_RECONSTRUCTION_PROGRESSIVE_AUTHORITY_PAGES)[number]) {
  return [
    page.title,
    page.intro,
    page.shortAnswer,
    ...page.timeline.flatMap((item) => [item.event, item.meaning]),
    ...page.sections.flatMap((section) => [section.heading, ...section.paragraphs]),
    ...page.faqs.flatMap((faq) => [faq.question, faq.answer]),
  ].join(" ").trim().split(/\s+/).filter(Boolean).length;
}

describe("post-Reconstruction and Progressive Era authority pages", () => {
  it("publishes the complete Phase 8 cluster", () => {
    expect(TEXAS_POST_RECONSTRUCTION_PROGRESSIVE_AUTHORITY_PAGES).toHaveLength(6);
  });

  it("keeps every published authority page substantive", () => {
    for (const page of TEXAS_POST_RECONSTRUCTION_PROGRESSIVE_AUTHORITY_PAGES) {
      expect(page.timeline.length, page.slug).toBeGreaterThanOrEqual(8);
      expect(page.sections.length, page.slug).toBeGreaterThanOrEqual(5);
      expect(page.faqs.length, page.slug).toBeGreaterThanOrEqual(3);
      expect(page.sources.length, page.slug).toBeGreaterThanOrEqual(5);
      expect(page.relatedLinks.length, page.slug).toBeGreaterThanOrEqual(5);
      expect(pageWordCount(page), page.slug).toBeGreaterThanOrEqual(850);
    }
  });

  it("uses authoritative Texas institutional and historical source families", () => {
    for (const page of TEXAS_POST_RECONSTRUCTION_PROGRESSIVE_AUTHORITY_PAGES) {
      for (const source of page.sources) {
        const host = new URL(source.href).hostname;
        expect(AUTHORITATIVE_SOURCE_HOSTS.has(host), `${page.slug}: ${host}`).toBe(true);
      }
    }
  });

  it("connects each page to the existing political/government authority graph", () => {
    for (const page of TEXAS_POST_RECONSTRUCTION_PROGRESSIVE_AUTHORITY_PAGES) {
      expect(page.relatedLinks.some((link) => link.href.startsWith("/texas-politics") || link.href.startsWith("/texas-government")), page.slug).toBe(true);
    }
  });

  it("uses unique slugs, titles and descriptions", () => {
    const slugs = TEXAS_POST_RECONSTRUCTION_PROGRESSIVE_AUTHORITY_PAGES.map((page) => page.slug);
    const titles = TEXAS_POST_RECONSTRUCTION_PROGRESSIVE_AUTHORITY_PAGES.map((page) => page.seoTitle);
    const descriptions = TEXAS_POST_RECONSTRUCTION_PROGRESSIVE_AUTHORITY_PAGES.map((page) => page.description);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });
});
