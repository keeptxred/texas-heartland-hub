import { describe, expect, it } from "vitest";
import { TEXAS_POLITICAL_HISTORY_AUTHORITY_PAGES } from "./texas-political-history-authority";

const AUTHORITATIVE_SOURCE_HOSTS = new Set([
  "www.archives.gov",
  "www.justice.gov",
  "www.senate.gov",
  "www.sos.state.tx.us",
  "www.supremecourt.gov",
  "www.tshaonline.org",
  "www.tsl.texas.gov",
  "lrl.texas.gov",
  "redistricting.capitol.texas.gov",
  "senate.texas.gov",
  "statutes.capitol.texas.gov",
  "tlc.texas.gov",
]);

function pageWordCount(page: (typeof TEXAS_POLITICAL_HISTORY_AUTHORITY_PAGES)[number]) {
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

describe("Texas political history authority pages", () => {
  it("keeps every published page substantive", () => {
    for (const page of TEXAS_POLITICAL_HISTORY_AUTHORITY_PAGES) {
      expect(page.timeline.length, page.slug).toBeGreaterThanOrEqual(8);
      expect(page.sections.length, page.slug).toBeGreaterThanOrEqual(5);
      expect(page.faqs.length, page.slug).toBeGreaterThanOrEqual(3);
      expect(page.sources.length, page.slug).toBeGreaterThanOrEqual(5);
      expect(page.relatedLinks.length, page.slug).toBeGreaterThanOrEqual(5);
      expect(pageWordCount(page), page.slug).toBeGreaterThanOrEqual(850);
    }
  });

  it("uses authoritative institutional or archival source families", () => {
    for (const page of TEXAS_POLITICAL_HISTORY_AUTHORITY_PAGES) {
      for (const source of page.sources) {
        const host = new URL(source.href).hostname;
        expect(AUTHORITATIVE_SOURCE_HOSTS.has(host), `${page.slug}: ${host}`).toBe(true);
      }
    }
  });

  it("connects every history page back to current civic authority", () => {
    for (const page of TEXAS_POLITICAL_HISTORY_AUTHORITY_PAGES) {
      const hrefs = new Set(page.relatedLinks.map((link) => link.href));
      expect(hrefs.has("/elections/2026"), page.slug).toBe(true);
    }
  });

  it("uses unique slugs, titles, canonicals and descriptions", () => {
    const slugs = TEXAS_POLITICAL_HISTORY_AUTHORITY_PAGES.map((page) => page.slug);
    const titles = TEXAS_POLITICAL_HISTORY_AUTHORITY_PAGES.map((page) => page.seoTitle);
    const descriptions = TEXAS_POLITICAL_HISTORY_AUTHORITY_PAGES.map((page) => page.description);

    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });
});
