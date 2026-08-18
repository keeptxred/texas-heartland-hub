import { describe, expect, it } from "vitest";
import {
  centralClock,
  facebookDailyTargetMinutes,
  facebookPostingDecision,
  formatCentralMinute,
} from "@/lib/facebook-posting-schedule";

describe("Facebook randomized posting schedule", () => {
  it("generates five stable daily targets inside separated Texas-time windows", () => {
    const targets = facebookDailyTargetMinutes("2026-08-18", "secret-seed");
    expect(targets).toHaveLength(5);
    expect(targets[0]).toBeGreaterThanOrEqual(7 * 60 + 15);
    expect(targets[0]).toBeLessThanOrEqual(9 * 60 + 15);
    expect(targets[1]).toBeGreaterThanOrEqual(10 * 60 + 15);
    expect(targets[2]).toBeGreaterThanOrEqual(13 * 60 + 15);
    expect(targets[3]).toBeGreaterThanOrEqual(16 * 60 + 15);
    expect(targets[4]).toBeGreaterThanOrEqual(19 * 60 + 15);
    expect(targets[4]).toBeLessThanOrEqual(21 * 60 + 30);
    expect(facebookDailyTargetMinutes("2026-08-18", "secret-seed")).toEqual(targets);
    expect(facebookDailyTargetMinutes("2026-08-19", "secret-seed")).not.toEqual(targets);
  });

  it("reads the clock in America/Chicago", () => {
    const clock = centralClock(new Date("2026-08-18T15:30:00Z"));
    expect(clock.dateKey).toBe("2026-08-18");
    expect(clock.minutes).toBe(10 * 60 + 30);
  });

  it("waits before the first randomized target and allows a due slot afterward", () => {
    const targets = facebookDailyTargetMinutes("2026-08-18", "seed");
    const beforeFirst = new Date("2026-08-18T12:00:00Z"); // 7:00 AM CDT
    expect(facebookPostingDecision({ now: beforeFirst, seed: "seed", recentPosts: [] }).shouldPost).toBe(false);

    const afterFirstLocalMinute = Math.min(targets[0] + 5, 9 * 60 + 20);
    const afterFirstUtc = new Date(Date.UTC(2026, 7, 18, Math.floor(afterFirstLocalMinute / 60) + 5, afterFirstLocalMinute % 60));
    const due = facebookPostingDecision({ now: afterFirstUtc, seed: "seed", recentPosts: [] });
    expect(due.shouldPost).toBe(true);
  });

  it("does not post twice for the same elapsed slot", () => {
    const now = new Date("2026-08-18T17:30:00Z"); // 12:30 PM CDT
    const decision = facebookPostingDecision({
      now,
      seed: "seed",
      recentPosts: [{ title: "Earlier post", published_at: "2026-08-18T14:30:00Z" }],
    });
    expect(decision.postsToday).toBe(1);
    if (decision.elapsedSlots <= 1) expect(decision.shouldPost).toBe(false);
  });

  it("enforces the five-post Central-time daily cap", () => {
    const recentPosts = [14, 16, 18, 20, 22].map((hour, index) => ({
      title: `Post ${index + 1}`,
      published_at: `2026-08-18T${hour}:00:00Z`,
    }));
    const decision = facebookPostingDecision({
      now: new Date("2026-08-19T02:30:00Z"),
      seed: "seed",
      recentPosts,
    });
    expect(decision.postsToday).toBe(5);
    expect(decision.shouldPost).toBe(false);
    expect(decision.reason).toContain("cap");
  });

  it("keeps a minimum gap after any recent Facebook post", () => {
    const now = new Date("2026-08-19T01:30:00Z"); // 8:30 PM CDT
    const decision = facebookPostingDecision({
      now,
      seed: "seed",
      recentPosts: [{ title: "Recent", published_at: "2026-08-19T01:00:00Z" }],
    });
    if (decision.elapsedSlots > decision.postsToday) {
      expect(decision.shouldPost).toBe(false);
      expect(decision.reason).toContain("75 minutes");
    }
  });

  it("formats target minutes for logs", () => {
    expect(formatCentralMinute(7 * 60 + 5)).toBe("7:05 AM CT");
    expect(formatCentralMinute(20 * 60 + 17)).toBe("8:17 PM CT");
    expect(formatCentralMinute(null)).toBeNull();
  });
});
