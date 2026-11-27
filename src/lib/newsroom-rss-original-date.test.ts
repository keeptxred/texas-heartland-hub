import { describe, expect, it } from "vitest";
import { verifiedRssIngestTimestamp } from "./newsroom-rss-original-date";

const now = new Date("2026-11-27T14:00:00Z");
describe("verified RSS ingestion publication dates", () => {
  it("does not redraft an old state agency release as today's news", () => {
    for (const url of [
      "https://www.sos.state.tx.us/about/newsreleases/2025/103025.shtml",
      "https://www.sos.state.tx.us/about/newsreleases/2025/102925.shtml",
      "https://www.sos.state.tx.us/about/newsreleases/2026/092326.shtml",
      "https://www.tdi.texas.gov/news/2026/tdi07272026.html",
    ]) expect(verifiedRssIngestTimestamp(now.toISOString(), url, now)).toBeNull();
  });
  it("rejects refreshed dates while preserving plausible publisher timestamps", () => {
    expect(verifiedRssIngestTimestamp("2026-11-27T14:00:00Z", "https://www.sos.state.tx.us/about/newsreleases/2026/112526.shtml", now)).toBeNull();
    expect(verifiedRssIngestTimestamp("2026-11-26T02:00:00Z", "https://www.sos.state.tx.us/about/newsreleases/2026/112526.shtml", now)).toBe("2026-11-26T02:00:00.000Z");
    expect(verifiedRssIngestTimestamp(null, "https://www.sos.state.tx.us/about/newsreleases/2026/112526.shtml", now)).toBeNull();
    expect(verifiedRssIngestTimestamp("2026-11-25T18:00:00Z", "https://www.tdi.texas.gov/news/2026/tdi11252026.html", now)).toBe("2026-11-25T18:00:00.000Z");
  });
  it("rejects invalid, stale, contradictory and absent dates", () => {
    for (const value of [null, "", "invalid", "2001-01-01", "2027-01-01"]) {
      expect(verifiedRssIngestTimestamp(value, "https://example.org/story", now)).toBeNull();
    }
    expect(verifiedRssIngestTimestamp(now.toISOString(), "https://www.sos.state.tx.us/about/newsreleases/2026/113026.shtml", now)).toBeNull();
    expect(verifiedRssIngestTimestamp(now.toISOString(), "https://www.sos.state.tx.us/about/newsreleases/2026/112525.shtml", now)).toBeNull();
    expect(verifiedRssIngestTimestamp(now.toISOString(), "https://www.tdi.texas.gov/news/2026/tdi11312026.html", now)).toBeNull();
  });
  it("keeps a recent ordinary RSS timestamp unchanged", () => {
    expect(verifiedRssIngestTimestamp("2026-11-26T12:30:00Z", "https://example.org/story", now)).toBe("2026-11-26T12:30:00.000Z");
  });
});
