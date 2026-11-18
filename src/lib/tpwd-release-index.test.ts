import { describe, expect, it } from "vitest";
import { parseTpwdReleaseIndex } from "@/lib/tpwd-release-index";

const now = Date.parse("2026-11-17T23:00:00Z");
const english = "Rainbow Trout Stocking Heads Back to Texas Waters Nov. 24";
const datedAnchor = (href: string, text: string) => '<a class="release" href="' + href + '">' + text + '</a>';

describe("official TPWD source-index parsing", () => {
  it("separates the real headline from the excerpt and uses the release date, not the crawl date", () => {
    const html = datedAnchor("?req=20261117a",
      english + " AUSTIN &ndash; The Texas Parks and Wildlife Department will begin stocking rainbow trout Nov. 24.");
    const [story] = parseTpwdReleaseIndex(html, now);
    expect(story.title).toBe(english);
    expect(story.description).toMatch(/^The Texas Parks and Wildlife Department/);
    expect(story.pub_date).toBe("2026-11-17T00:00:00.000Z");
    expect(story.link).toBe("https://tpwd.texas.gov/newsmedia/releases/?req=20261117a");
    expect(story.source).toBe("Texas Parks & Wildlife");
  });

  it("handles entity-encoded Spanish without mangling titles and does not duplicate URLs", () => {
    const html = datedAnchor("?req=20261117b",
      "El Reabastecimiento de Trucha Arco&iacute;ris Regresa a Texas AUSTIN &ndash; Llegada de invierno.")
      + datedAnchor("?req=20261117b", "Another headline AUSTIN – More text.");
    const rows = parseTpwdReleaseIndex(html, now);
    expect(rows).toHaveLength(1);
    expect(rows[0].title).toContain("Arcoíris");
  });

  it("does not turn stale release-index rows into fresh news or accept future and invalid dates", () => {
    const html = datedAnchor("?req=20260915a", "Old release AUSTIN – Long ago.")
      + datedAnchor("?req=20261120a", "Future release AUSTIN – Not yet.")
      + datedAnchor("?req=20261131a", "Invalid release AUSTIN – No such date.");
    expect(parseTpwdReleaseIndex(html, now)).toEqual([]);
  });

  it("rejects external lookalikes, URLs with extra parameters, scripts and bloated headlines", () => {
    const html = datedAnchor("https://tpwd.texas.gov.evil.example/newsmedia/releases/?req=20261117a",
      "Texas Fishing release AUSTIN – Spoofed.")
      + datedAnchor("?req=20261117a&other=1", "Texas park notice AUSTIN – Untrusted.")
      + datedAnchor("?req=20261117a", "Long Texas park " + "example ".repeat(35))
      + datedAnchor("?req=20261117c", "Texas Park <script>alert('unsafe')</script> event AUSTIN – Safe body.");
    const rows = parseTpwdReleaseIndex(html, now);
    expect(rows).toHaveLength(1);
    expect(rows[0].title).toBe("Texas Park event");
  });

  it("keeps short, clean first-party titles even when no excerpt exists", () => {
    const rows = parseTpwdReleaseIndex(
      datedAnchor("https://tpwd.texas.gov/newsmedia/releases/?req=20261116a",
        "Texas State Parks Family Volunteer Day on Nov. 21"), now);
    expect(rows).toHaveLength(1);
    expect(rows[0].description).toBe(rows[0].title);
  });
});
