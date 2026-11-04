import { describe, expect, it } from "vitest";
import { parseEstimatedCountFeed } from "./estimated-count-progress.server";

const now = Date.parse("2026-11-04T03:30:00.000Z");
const record = (sourceName: string, sourceFamily: string, percent: number, updatedAt = "2026-11-04T03:25:00.000Z") => ({
  raceId: "u-s-senator", sourceName, sourceFamily, percent, updatedAt,
  sourceUrl: "https://example.org/elections/texas-2026",
});

describe("authorized election-night estimated votes counted", () => {
  it("averages independent provider estimates, not SOS polling locations", () => {
    const result = parseEstimatedCountFeed({
      electionDate: "2026-11-03",
      estimates: [record("Source A", "a", 55), record("Source B", "b", 59)],
    }, ["u-s-senator"], now);
    expect(result["u-s-senator"].percent).toBe(57);
    expect(result["u-s-senator"].method).toBe("independent_mean");
    expect(result["u-s-senator"].sources).toHaveLength(2);
  });

  it("does not double-count networks using the same underlying data family", () => {
    const result = parseEstimatedCountFeed({
      electionDate: "2026-11-03",
      estimates: [
        record("Network A", "ap", 55, "2026-11-04T03:24:00.000Z"),
        record("Network B", "ap", 57, "2026-11-04T03:26:00.000Z"),
        record("Independent provider", "ddhq", 61),
      ],
    }, ["u-s-senator"], now);
    expect(result["u-s-senator"].percent).toBe(59);
    expect(result["u-s-senator"].sources).toHaveLength(2);
  });

  it("rejects stale, future, unverified URL, invalid value, wrong race, wrong election", () => {
    const estimates = [
      record("Stale", "a", 55, "2026-11-04T02:00:00.000Z"),
      record("Future", "b", 55, "2026-11-04T03:40:00.000Z"),
      { ...record("Invalid", "c", 55), sourceUrl: "http://localhost:8787" },
      record("Invalid percentage", "d", 120),
      { ...record("Wrong race", "e", 60), raceId: "unknown-race" },
    ];
    expect(parseEstimatedCountFeed({ electionDate: "2026-11-03", estimates }, ["u-s-senator"], now)).toEqual({});
    expect(parseEstimatedCountFeed({ electionDate: "2024-11-05", estimates: [record("Source", "a", 55)] }, ["u-s-senator"], now)).toEqual({});
  });

  it("does not claim an independent mean when only one provider remains", () => {
    const result = parseEstimatedCountFeed({ electionDate: "2026-11-03", estimates: [record("One licensed provider", "a", 55)] }, ["u-s-senator"], now);
    expect(result["u-s-senator"].method).toBe("single_provider");
    expect(result["u-s-senator"].percent).toBe(55);
  });
});
