import { describe, expect, it } from "vitest";
import { getNextElection, daysUntil, nextElectionHeadline } from "./election-calendar";

describe("Texas election countdown", () => {
  it("uses the current Texas civil date, not early UTC rollover", () => {
    // Oct 30 at 03:00 UTC is still October 29 in Texas (10 PM CDT).
    const now = new Date("2026-10-30T03:00:00Z");
    const election = getNextElection(now);
    expect(election?.date).toBe("2026-11-03");
    expect(election ? daysUntil(election, now) : null).toBe(5);
    expect(nextElectionHeadline(now)).toBe("5 Days to Texas General Election");
  });

  it("never shows a stale 2026 year after scheduled events are exhausted", () => {
    expect(nextElectionHeadline(new Date("2029-01-03T18:00:00Z"))).not.toContain("2026");
  });
});
