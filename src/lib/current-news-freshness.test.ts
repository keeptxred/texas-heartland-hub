import { describe, expect, it } from "vitest";
import { CURRENT_NEWS_WINDOW_DAYS, isCurrentNewsCandidate } from "@/lib/current-news-freshness";
import { rankFacebookCandidates } from "@/lib/facebook-editorial-selection";

const now = new Date("2026-10-14T20:00:00Z");

describe("current-news versus recovered-history editorial boundary", () => {
  it("displays actual recently published stories as current news", () => {
    expect(CURRENT_NEWS_WINDOW_DAYS).toBe(7);
    expect(isCurrentNewsCandidate({ published_at: "2026-10-13T18:00:00Z", quality_flags: [] }, now)).toBe(true);
    expect(isCurrentNewsCandidate({ published_at: "2026-10-08T20:00:00Z" }, now)).toBe(true);
  });

  it("never treats a three-month-old story or a recovered URL as breaking/new", () => {
    expect(isCurrentNewsCandidate({ published_at: "2026-07-03T12:00:00Z" }, now)).toBe(false);
    expect(isCurrentNewsCandidate({ published_at: "2026-10-14T18:00:00Z", quality_flags: ["legacy_url_restored"] }, now)).toBe(false);
    expect(isCurrentNewsCandidate({ published_at: "2026-10-14T18:00:00Z", quality_flags: ["historical_archive"] }, now)).toBe(false);
    expect(isCurrentNewsCandidate({ published_at: "invalid" }, now)).toBe(false);
    expect(isCurrentNewsCandidate({ published_at: "2026-11-14T18:00:00Z" }, now)).toBe(false);
  });

  it("guards Facebook ranking against stale news, tampered dates and legacy restorations", () => {
    const ranked = rankFacebookCandidates([
      { title: "New Texas Grid Policy Filing Verified", category: "Energy", kind: "news", published_at: "2026-10-14T18:00:00Z", score: 75, quality_flags: [] },
      { title: "Old Texas Flood Report", category: "Government", kind: "news", published_at: "2026-07-03T12:00:00Z", score: 100, quality_flags: [] },
      { title: "Reconstructed Texas Grid History", category: "Energy", kind: "news", published_at: "2026-10-14T19:00:00Z", score: 100, quality_flags: ["legacy_url_restored"] },
      { title: "Texas Legal Update From Last Week", category: "Laws", kind: "news", published_at: "2026-10-08T19:00:00Z", score: 100, quality_flags: [] },
    ], [], now);
    expect(ranked.map(({candidate}) => candidate.title)).toEqual(["New Texas Grid Policy Filing Verified"]);
  });
});
