import { describe, expect, it, vi } from "vitest";
import { ISSUER_RESEARCH_FEEDS, issuerResearchFeedsForSubjects, parseIssuerResearchRecords, issuerRecordNearEvent, issuerReleaseLinks, parseIssuerReleasePage, fetchIssuerResearchRecords } from "./newsroom-issuer-rss-evidence";
import { extractFirstPartyRssArticleBody } from "./newsroom-firstparty-rss-body";

const now = Date.parse("2026-11-24T20:00:00Z");
const feed = ISSUER_RESEARCH_FEEDS[0]!;
const subject = "NVIDIA reinstates Jensen Huang as CEO";
const url = "https://nvidianews.nvidia.com/news/nvidia-board-reinstates-jensen-huang-as-president-ceo-and-board-director";
const release = "NVIDIA announced that Jensen Huang has been reinstated as president and CEO and director following a unanimous board decision. The directors met to consider the leadership transition and the responsibilities of the company's executives. Colette Kress remains chief financial officer following her temporary service as interim chief executive. Harvey Jones continues as chair of the board. The directors described the leadership change and their decision to retain outside counsel for an ongoing review. The company explained that the review remains open and that the directors will continue to evaluate the evidence before reaching final conclusions. The release reports the company's own decisions and does not independently resolve any external investigation.";
function item(link = url, date = "Mon, 23 Nov 2026 13:55:00 GMT", title = "NVIDIA Board Reinstates Jensen Huang as President, CEO and Board Director") {
  return '<item><title>' + title + '</title><link>' + link + '</link><contentType>releases</contentType><content><![CDATA[<p>' + release + '</p>]]></content><pubDate>' + date + '</pubDate></item>';
}
function rss(...items: string[]) { return "<rss><channel>" + items.join("") + "</channel></rss>"; }

describe("issuer evidence research without broad national ingestion", () => {
  it("uses the official feed only for a named existing issuer event", () => {
    expect(issuerResearchFeedsForSubjects([subject])).toEqual([feed]);
    expect(issuerResearchFeedsForSubjects(["Texas county approves budget"])).toEqual([]);
    expect(parseIssuerResearchRecords(rss(item()), feed, [subject], now)).toMatchObject([
      { title: "NVIDIA Board Reinstates Jensen Huang as President, CEO and Board Director", url, isPrimarySource: true, publishedAt: "2026-11-23T13:55:00.000Z" },
    ]);
    expect(parseIssuerResearchRecords(rss(item()), feed, ["NVIDIA launches new gaming GPU"], now)).toEqual([]);
  });
  it("rejects stale, fabricated-date, foreign-host, and repeated records", () => {
    expect(parseIssuerResearchRecords(rss(item(url, "Mon, 16 Nov 2026 13:55:00 GMT"), item(url, "invalid"), item("https://nvidianews.nvidia.com.example.org/news/fake"), item(), item()), feed, [subject], now)).toHaveLength(1);
    expect(parseIssuerResearchRecords(rss(item()), {...feed, url: "https://example.org/rss"}, [subject], now)).toEqual([]);
  });
  it("allows older issuer evidence only for the bounded research archive and checks event timing", () => {
    const later = Date.parse("2026-11-27T14:00:00Z");
    expect(parseIssuerResearchRecords(rss(item()), feed, [subject], later)).toEqual([]);
    expect(parseIssuerResearchRecords(rss(item()), feed, [subject], later, true)).toHaveLength(1);
    expect(parseIssuerResearchRecords(rss(item()), feed, [subject], Date.parse("2026-12-01T14:00:00Z"), true)).toEqual([]);
    expect(issuerRecordNearEvent("2026-11-23T13:55:00Z", "2026-11-23T18:11:02Z")).toBe(true);
    expect(issuerRecordNearEvent("2026-11-23T13:55:00Z", "2026-11-27T14:00:00Z")).toBe(false);
    expect(issuerRecordNearEvent(null, "2026-11-23T18:11:02Z")).toBe(false);
    expect(issuerRecordNearEvent("invalid", "2026-11-23T18:11:02Z")).toBe(false);
  });
  it("follows matching first-party release anchors and extracts only the dated release", () => {
    const heading = "NVIDIA Board Reinstates Jensen Huang as President, CEO and Board Director";
    const index = '<a href="https://nvidianews.nvidia.com.evil.example/news/fake">' + heading + '</a><a href="' + url + '"><span>' + heading + '</span></a><a href="' + url + '">Read More</a>';
    expect(issuerReleaseLinks(index, ["nvidia s board directors brings jensen huang back as ceo"])).toEqual([url]);
    expect(issuerReleaseLinks(index, ["NVIDIA CEO Jensen Huang resigns"])).toEqual([]);
    const html = "<h1>" + heading + "</h1><div>November 23, 2026</div><p>" + release + "</p><h2>Media Contacts</h2><p>Unrelated story</p>";
    const later = Date.parse("2026-11-27T14:00:00Z");
    expect(parseIssuerReleasePage(html, url, feed, [subject], later, false)).toBeNull();
    expect(parseIssuerReleasePage(html, url, feed, [subject], later, true)?.extractedBody).toBe(release);
    expect(parseIssuerReleasePage(html.replace("November 23, 2026", "No date"), url, feed, [subject], later, true)).toBeNull();
    expect(parseIssuerReleasePage(html, url, feed, ["NVIDIA CEO Jensen Huang resigns"], later, true)).toBeNull();
  });
  it("observes bounded same-resource redirects and uses ordinary ingestion headers", async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(new Response(null, { status: 301, headers: { location: feed.url + "/" } }))
      .mockResolvedValueOnce(new Response(rss(item()), { headers: { "content-type": "text/xml" } }));
    vi.stubGlobal("fetch", fetcher);
    const clock = vi.spyOn(Date, "now").mockReturnValue(Date.parse("2026-11-27T15:00:00Z"));
    try {
      const result = await fetchIssuerResearchRecords(feed, [subject], true);
      expect(result.records).toHaveLength(1);
      expect(result.fetched).toBe(2);
      expect(fetcher).toHaveBeenNthCalledWith(1, feed.url, expect.objectContaining({ redirect: "manual", headers: expect.objectContaining({ "Accept-Language": "en-US,en;q=0.9", "Cache-Control": "no-cache" }) }));
      expect(fetcher).toHaveBeenNthCalledWith(2, feed.url + "/", expect.anything());
    } finally { clock.mockRestore(); vi.unstubAllGlobals(); }
  });
  it("does not follow external redirects or retry access denials", async () => {
    for (const response of [
      new Response(null, { status: 302, headers: { location: "https://example.org/rss" } }),
      new Response(null, { status: 302, headers: { location: "/login" } }),
      new Response(null, { status: 403 }),
      new Response(null, { status: 429 }),
    ]) {
      const fetcher = vi.fn().mockResolvedValueOnce(response);
      vi.stubGlobal("fetch", fetcher);
      try {
        const result = await fetchIssuerResearchRecords(feed, [subject], true);
        expect(result.records).toEqual([]);
        expect(result.fetched).toBe(1);
        expect(fetcher).toHaveBeenCalledTimes(1);
      } finally { vi.unstubAllGlobals(); }
    }
  });
  it("reports the actual network error without adding unbounded attempts", async () => {
    const fetcher = vi.fn().mockRejectedValue(new TypeError("network transport failed"));
    vi.stubGlobal("fetch", fetcher);
    try {
      const result = await fetchIssuerResearchRecords(feed, [subject], true);
      expect(result.diagnostics).toContain("/cats/press_release.xml TypeError: network transport failed");
      expect(result.fetched).toBe(2);
    } finally { vi.unstubAllGlobals(); }
  });
  it("permits nonstandard content only on the verified NVIDIA release path", () => {
    expect(extractFirstPartyRssArticleBody(item(), feed.source, url)).toContain("Jensen Huang");
    expect(extractFirstPartyRssArticleBody(item(), feed.source, "https://example.org/news/fake")).toBeNull();
    expect(extractFirstPartyRssArticleBody(item().replace("<contentType>releases</contentType>", ""), feed.source, url)).toBeNull();
  });
});
