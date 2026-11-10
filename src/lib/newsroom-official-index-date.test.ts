import { describe, expect, it } from "vitest";
import {
  verifiedOfficialArticlePublishedAt,
  verifiedOfficialArticleTitle,
  verifiedOfficialIndexLinks,
} from "./newsroom-official-index-date";

const NOW = Date.parse("2026-11-09T23:50:00Z");

describe("first-party official newsroom research", () => {
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
    expect(verifiedOfficialArticlePublishedAt('<time datetime="2026-12-20">Future</time>', NOW)).toBeNull();
    expect(verifiedOfficialArticlePublishedAt('<meta itemprop="datePublished" content="invalid">', NOW)).toBeNull();
  });

  it("only derives headlines from the real article H1", () => {
    expect(verifiedOfficialArticleTitle("<html><h1>UTEP genetic research on North American mallards</h1></html>"))
      .toBe("UTEP genetic research on North American mallards");
    expect(verifiedOfficialArticleTitle("<h1>News</h1>")).toBeNull();
    expect(verifiedOfficialArticleTitle("<h2>UTEP story</h2>")).toBeNull();
  });
});