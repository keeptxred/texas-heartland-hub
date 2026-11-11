import { describe, expect, it } from "vitest";
import {
  verifiedOfficialArticlePublishedAt,
  verifiedOfficialArticleTitle,
  verifiedOfficialIndexLinks,
  verifiedOfficialDatedIndexEntries,
} from "./newsroom-official-index-date";

const NOW = Date.parse("2026-11-09T23:50:00Z");

describe("first-party official newsroom research", () => {

  it("admits original dated Arlington listing cards as discovery-only pointers when individual pages block fetches", () => {
    const listing = [
      '<a class="card" href="/News-Articles/2026/November/Donate-Childrens-Coats-Hats-and-Gloves-at-Arlington-Fire-Stations"><h3>Donate Children&#39;s Coats, Hats and Gloves at Arlington Fire Stations</h3><div>Published on November 11, 2026</div><p>Local winter coat drive announced by the city.</p><span>Tagged as: Fire</span></a>',
      '<a href="https://www.arlingtontx.gov/News-Articles/2026/November/Pyburn-House-Becomes-Arlingtons-Newest-Local-Landmark">Pyburn House Becomes Arlington’s Newest Local Landmark Published on November 10, 2026 Historic landmark.</a>',
    ].join("");
    const items = verifiedOfficialDatedIndexEntries(
      listing, "https://www.arlingtontx.gov/News-Events/All-News",
      /^\/News-Articles\/20\d{2}\/[A-Za-z]+\/[a-zA-Z0-9_.-]+\/?$/i,
      Date.parse("2026-11-11T19:00:00Z"), 4,
    );
    expect(items).toHaveLength(2);
    expect(items[0].title).toContain("Coats");
    expect(items[0].publishedAt).toBe("2026-11-11T12:00:00.000Z");
    expect(items[0].description).toBe("Local winter coat drive announced by the city.");
    expect(items[1].publishedAt).toBe("2026-11-10T12:00:00.000Z");
  });

  it("rejects malformed, archival, off-domain, undated and fabricated future Arlington items", () => {
    const bad = [
      '<a href="/News-Articles/2026/November/Undated-Civic-Update">Undated Civic Update</a>',
      '<a href="/News-Articles/2026/November/Impossible-Date">Impossible date Published on November 31, 2026</a>',
      '<a href="/News-Articles/2026/September/Old-News">Old library update Published on September 1, 2026</a>',
      '<a href="/News-Articles/2026/December/Future-Date">Future parks plans Published on December 12, 2026</a>',
      '<a href="https://attacker.example/News-Articles/2026/November/Outside">Wrong publisher Published on November 10, 2026</a>',
      '<a href="/News-Events/All-News">Fake index page Published on November 10, 2026</a>',
    ].join("");
    expect(verifiedOfficialDatedIndexEntries(
      bad, "https://www.arlingtontx.gov/News-Events/All-News",
      /^\/News-Articles\/20\d{2}\/[A-Za-z]+\/[a-zA-Z0-9_.-]+\/?$/i,
      Date.parse("2026-11-11T19:00:00Z"),
    )).toEqual([]);
  });

  it("accepts only fixed publisher article paths and rejects other hosts, trackers and duplicates", () => {
    const links = verifiedOfficialIndexLinks(
      '<a href="/newsfeed/2026/november/ducks.html">Ducks</a>' +
      '<a href="https://attack.invalid/newsfeed/2026/november/fake.html">Wrong host</a>' +
      '<a href="/newsfeed/2025/november/old.html">Older but for date validation</a>' +
      '<a href="/newsfeed/2026/november/ducks.html?utm=foo">Repeat</a>' +
      '<a href="/calendar.html">Unrelated link</a>',
      "https://www.utep.edu/newsfeed/news.html",
      /^\/newsfeed\/20\d{2}\/[a-z]+\/[a-z0-9-]+\.html$/,
    );
    expect(links).toEqual([
      "https://www.utep.edu/newsfeed/2026/november/ducks.html",
      "https://www.utep.edu/newsfeed/2025/november/old.html",
    ]);
  });

  it("requires an original primary-publisher date, not crawl time, last-modified only, or preview", () => {
    const metadata = '<meta property="article:published_time" content="2026-11-04T09:00:00Z">';
    expect(verifiedOfficialArticlePublishedAt(metadata, NOW)).toBe("2026-11-04T09:00:00.000Z");
    expect(verifiedOfficialArticlePublishedAt(
      '<meta property="article:modified_time" content="2026-11-09T19:00:00Z">', NOW,
    )).toBeNull();
    expect(verifiedOfficialArticlePublishedAt("<h1>Research headline on Nov 9</h1>", NOW)).toBeNull();
    expect(verifiedOfficialArticlePublishedAt('<script type="application/ld+json">{"datePublished":"2026-11-07T14:00:00Z"}</script>', NOW))
      .toBe("2026-11-07T14:00:00.000Z");
    expect(verifiedOfficialArticlePublishedAt(
      "<div>Last Updated on November 09, 2026 | Originally published November 04, 2026</div>", NOW,
    )).toBe("2026-11-04T00:00:00.000Z");
  });

  it("never makes archived, invalid, or future research news appear newly published", () => {
    expect(verifiedOfficialArticlePublishedAt('<meta name="datePublished" content="2026-09-01">', NOW)).toBeNull();
    expect(verifiedOfficialArticlePublishedAt('<meta name="datePublished" content="2026-09-01"><p>Published on November 9, 2026</p>', NOW)).toBeNull();
    expect(verifiedOfficialArticlePublishedAt('<time datetime="2026-12-20">Future</time>', NOW)).toBeNull();
    expect(verifiedOfficialArticlePublishedAt('<meta itemprop="datePublished" content="invalid">', NOW)).toBeNull();
  });

  it("only derives headlines from the real article H1", () => {
    expect(verifiedOfficialArticleTitle("<html><h1>UTEP genetic research on North American mallards</h1></html>"))
      .toBe("UTEP genetic research on North American mallards");
    expect(verifiedOfficialArticleTitle("<h1>News</h1>")).toBeNull();
    expect(verifiedOfficialArticleTitle("<h2>UTEP story</h2>")).toBeNull();
    expect(verifiedOfficialArticleTitle('<h1><a href="/newsfeed/">Newsfeed</a></h1>' +
      '<h1>UTEP Researcher Leads First-of-Its-Kind Study on Genetic Changes in Wild Ducks</h1>'))
      .toBe("UTEP Researcher Leads First-of-Its-Kind Study on Genetic Changes in Wild Ducks");
    expect(verifiedOfficialArticleTitle("<h1>Newsfeed</h1><h1>404 Not Found</h1><h1>Suggested Stories</h1>"))
      .toBeNull();
    expect(verifiedOfficialArticleTitle("<h1>Newsfeed</h1><h1>Latest</h1>")).toBeNull();
  });
});