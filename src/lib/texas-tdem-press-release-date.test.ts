import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { datedTdemReleasePublishedAt } from "./texas-tdem-press-release-date";

const now = Date.parse("2026-10-30T12:00:00Z");
const ingest = readFileSync(new URL("../routes/api/public/hooks/ingest-feeds.ts", import.meta.url), "utf8");

describe("first-party TDEM press-release discovery", () => {
  it("uses the actual TDEM permalink date instead of pretending an archive listing was published today", () => {
    expect(datedTdemReleasePublishedAt("/press-release/10-29-26", now)).toBe("2026-10-29T12:00:00.000Z");
    expect(datedTdemReleasePublishedAt("/press-release/10-28-26/", now)).toBe("2026-10-28T12:00:00.000Z");
    expect(datedTdemReleasePublishedAt("/press-release/10-15-26", now)).toBe("2026-10-15T12:00:00.000Z");
    expect(datedTdemReleasePublishedAt("/press-release/09-29-26", now)).toBeNull();
    expect(datedTdemReleasePublishedAt("/press-release/10-30-25", now)).toBeNull();
  });

  it("rejects invalid, unverifiable or misleading release dates", () => {
    for (const path of [
      "/press-release/today", "/press-release/02-29-25", "/press-release/11-31-26",
      "/press-release/00-10-26", "/press-release/10-00-26",
      "/press-release/11-05-26", "/some-news/10-29-26",
      "/press-release/10-29-26/latest",
    ]) expect(datedTdemReleasePublishedAt(path, now)).toBeNull();
  });

  it("uses the existing bounded direct-source ingestion path and never a date-free fallback", () => {
    expect(ingest).toContain('name: "Texas Division of Emergency Management — Direct Releases"');
    expect(ingest).toContain('url: "https://www.tdem.texas.gov/press-release"');
    expect(ingest).toContain('include: "^/press-release/[0-9]{1,2}-[0-9]{1,2}-[0-9]{2}/?$"');
    expect(ingest).toContain("datedTdemReleasePublishedAt(parsed.pathname)");
    expect(ingest).toContain("if (!dated) continue");
    expect(ingest).toContain("publishDate = dated");
    expect(ingest).toContain('mode: "html-links"');
  });
});
