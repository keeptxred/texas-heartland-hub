import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { datedDpsReleaseFromIndexTail } from "./texas-dps-press-release-date";

const NOW = Date.parse("2026-10-30T18:00:00Z");
function dateFor(html: string): string | null {
  const anchorEnd = html.indexOf("</a>") + "</a>".length;
  return datedDpsReleaseFromIndexTail(html, anchorEnd, NOW);
}

describe("first-party Texas DPS release date integrity", () => {
  it("uses the actual index date immediately following a direct release heading", () => {
    const html = '<h3><a href="/news/texas-dps-receives-leadership-police-aviation-award-fifth-time">'
      + "Texas DPS Receives Leadership in Police Aviation Award for Fifth Time"
      + '</a></h3><time>October 28, 2026</time><p>AUSTIN – Texas DPS described its aviation award.</p>'
      + '<h3><a href="/news/other-release">Other release</a></h3><time>October 26, 2026</time>';
    expect(dateFor(html)).toBe("2026-10-28T12:00:00.000Z");
  });

  it("does not borrow another release's date or mark an undated article as new", () => {
    const missing = '<a href="/news/press-release-one">First record</a><h3>'
      + '<a href="/news/press-release-two">Second record</a><time>October 28, 2026</time>';
    expect(dateFor(missing)).toBeNull();
    expect(dateFor('<a href="/news/one">Record</a><p>No date published</p>')).toBeNull();
  });

  it("excludes historical archives, future dates and malformed calendar dates", () => {
    expect(dateFor('<a href="/news/one">Record</a><time>September 25, 2026</time>')).toBeNull();
    expect(dateFor('<a href="/news/one">Record</a><time>November 4, 2026</time>')).toBeNull();
    expect(dateFor('<a href="/news/one">Record</a><time>February 30, 2026</time>')).toBeNull();
    expect(datedDpsReleaseFromIndexTail("", -1, NOW)).toBeNull();
  });

  it("registers the verified first-party index and never assigns crawl-time dates to its pages", () => {
    const ingest = readFileSync("src/routes/api/public/hooks/ingest-feeds.ts", "utf8");
    expect(ingest).toContain("Texas DPS — Direct Press Releases");
    expect(ingest).toContain("https://www.dps.texas.gov/news/press-releases");
    expect(ingest).toContain('if (source.name === "Texas DPS — Direct Press Releases")');
    expect(ingest).toContain("datedDpsReleaseFromIndexTail(html, (match.index ?? 0) + match[0].length)");
    expect(ingest).toContain("if (!dated) continue;");
    expect(ingest).toContain("publishDate = dated;");
    expect(ingest).toContain('mode: "html-links"');
    expect(ingest).not.toContain('Texas DPS — Direct Press Releases", url: "https://www.dps.texas.gov/news/press-releases", category: "Local", mode: "rss"');
  });
});
