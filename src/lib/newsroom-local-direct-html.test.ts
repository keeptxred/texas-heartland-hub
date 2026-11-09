import { describe, expect, it } from "vitest";
import { parseFox4DatedLocalHtml, parseKrgvDatedLocalHtml } from "./newsroom-local-direct-html";

const now = Date.parse("2026-11-09T18:00:00Z");

const fox = [
  '<article class="article tag-article story-2 post">',
  '<div class="info"><header><h3 class="title tag-article__title">',
  '<a href="/news/midlothian-raid-targets-four-locations-multi-agency-investigation">',
  'FBI raids Midlothian oil and gas business facing multiple fraud lawsuits: sources</a>',
  '</h3></header><time datetime="2026-11-06T20:33">November 6</time></div>',
  '</article>',
].join("");

const krgv = [
  '<article class=" image-grid-item" data-item-id="289209">',
  '<div class="description"><div class="title long-title hide-in-grid-view">',
  '<a href="/news/spacex-sets-target-date-for-15th-starship-launch-at-starbase">',
  'SpaceX sets target date for 15th Starship launch at Starbase</a></div>',
  '<span class="timestamp" data-datetime="{ts \'2026-11-07 10:23:00\'}"></span>',
  '</div></article>',
].join("");

describe("first-party local publisher index discovery", () => {
  it("uses FOX 4's dated original investigation headline, never index crawl time", () => {
    const items = parseFox4DatedLocalHtml(fox, "FOX 4 Midlothian — Direct Local Headlines", now);
    expect(items).toHaveLength(1);
    expect(items[0].link).toBe("https://www.fox4news.com/news/midlothian-raid-targets-four-locations-multi-agency-investigation");
    expect(items[0].pub_date).toBe("2026-11-06T12:00:00.000Z");
    expect(items[0].title).toMatch(/Midlothian/);
  });

  it("uses KRGV's dated original Starbase headline", () => {
    const items = parseKrgvDatedLocalHtml(krgv, "KRGV Rio Grande Valley — Direct Local Headlines", now);
    expect(items).toHaveLength(1);
    expect(items[0].link).toBe("https://www.krgv.com/news/spacex-sets-target-date-for-15th-starship-launch-at-starbase");
    expect(items[0].pub_date).toBe("2026-11-07T12:00:00.000Z");
  });

  it("rejects stale, dateless, future and external cards instead of inventing publication dates", () => {
    expect(parseFox4DatedLocalHtml(fox.replace("2026-11-06T20:33", "2026-04-06T20:33"), "FOX 4", now)).toHaveLength(0);
    expect(parseFox4DatedLocalHtml(fox.replace(/<time\b[^>]*>[\s\S]*?<\/time>/, ""), "FOX 4", now)).toHaveLength(0);
    expect(parseFox4DatedLocalHtml(fox.replace("/news/midlothian-raid-targets-four-locations-multi-agency-investigation", "https://other.example/news/fake"), "FOX 4", now)).toHaveLength(0);
    expect(parseKrgvDatedLocalHtml(krgv.replace("2026-11-07", "2026-01-07"), "KRGV", now)).toHaveLength(0);
    expect(parseKrgvDatedLocalHtml(krgv.replace("2026-11-07", "2026-12-07"), "KRGV", now)).toHaveLength(0);
    expect(parseKrgvDatedLocalHtml(krgv.replace(/data-datetime="[^"]+"/, ""), "KRGV", now)).toHaveLength(0);
  });

  it("deduplicates repeated cards without altering publisher attribution", () => {
    const items = parseFox4DatedLocalHtml(fox + fox, "FOX 4 Midlothian — Direct Local Headlines", now);
    expect(items).toHaveLength(1);
    expect(items[0].source).toBe("FOX 4 Midlothian — Direct Local Headlines");
  });
});
