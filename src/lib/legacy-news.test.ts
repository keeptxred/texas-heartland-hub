import { describe, expect, it } from "vitest";
import { isLegacyLiveNewsSlug, legacyNewsRedirect } from "@/lib/legacy-news";

describe("legacy live news retirement", () => {
  it("redirects the obsolete voter-registration rewrite to the maintained voting guide", () => {
    expect(
      legacyNewsRedirect(
        "live-2026-07-19-voter-registration-countdown-begins-for-texas-2026-midterm-elections-yx9ejb",
      ),
    ).toBe("/news/texas-voting-guide-2026");
  });

  it("redirects the old Flock story to the stronger regional privacy article", () => {
    expect(
      legacyNewsRedirect(
        "live-2026-07-24-san-antonio-residents-seek-organized-opposition-to-flock-safety-survei-hz11ng",
      ),
    ).toBe("/news/2026-08-09-houston-flock-camera-backlash");
  });

  it("does not invent redirects for unrelated legacy stories", () => {
    expect(
      legacyNewsRedirect(
        "live-2026-07-20-state-representative-james-talarico-targets-federal-seat-in-tense-hous-ykruo0",
      ),
    ).toBeNull();
  });

  it("recognizes dated live-news legacy slugs", () => {
    expect(isLegacyLiveNewsSlug("live-2026-07-18-example-story-abc123")).toBe(true);
    expect(isLegacyLiveNewsSlug("2026-08-13-current-story")).toBe(false);
  });
});
