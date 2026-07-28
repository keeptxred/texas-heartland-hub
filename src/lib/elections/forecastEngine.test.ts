import { describe, expect, it } from "vitest";
import { runForecastModel } from "./forecastEngine";

const candidates = [
  {
    candidateId: "candidate-r",
    party: "republican",
    pollingAverage: 51,
    incumbencyAdjustment: 1,
    fundraisingAdjustment: 0.5,
    candidateQualityAdjustment: 0,
  },
  {
    candidateId: "candidate-d",
    party: "democratic",
    pollingAverage: 46,
    incumbencyAdjustment: 0,
    fundraisingAdjustment: 0,
    candidateQualityAdjustment: 0,
  },
] as const;

describe("forecast engine", () => {
  it("produces deterministic hybrid outputs when polling exists", () => {
    const first = runForecastModel({
      raceId: "race-1",
      asOf: "2026-07-28T12:00:00Z",
      candidates,
      previousElectionMargin: 8,
      districtPartisanLean: 6,
      electionEnvironment: -1,
      sourceUrls: ["https://example.com/polls", "https://example.com/history"],
    });
    const second = runForecastModel({
      raceId: "race-1",
      asOf: "2026-07-28T12:00:00Z",
      candidates,
      previousElectionMargin: 8,
      districtPartisanLean: 6,
      electionEnvironment: -1,
      sourceUrls: ["https://example.com/polls", "https://example.com/history"],
    });

    expect(first).toEqual(second);
    expect(first.model).toBe("hybrid");
    expect(first.fundamentalsBased).toBe(false);
    expect(first.projectedWinnerCandidateId).toBe("candidate-r");
    expect(first.candidateProbabilities[0].winProbability).toBeGreaterThan(0.5);
  });

  it("uses disclosed fundamentals without manufacturing polling averages", () => {
    const result = runForecastModel({
      raceId: "race-2",
      asOf: "2026-07-28T12:00:00Z",
      candidates: candidates.map((candidate) => ({ ...candidate, pollingAverage: null })),
      previousElectionMargin: -2,
      districtPartisanLean: -3,
      electionEnvironment: 1,
      sourceUrls: [
        "https://example.com/previous-result",
        "https://example.com/partisan-lean",
      ],
    });

    expect(result.model).toBe("fundamentals");
    expect(result.fundamentalsBased).toBe(true);
    expect(result.candidateProbabilities.every((candidate) => candidate.pollingAverage == null)).toBe(
      true,
    );
  });

  it("reports change from the previous forecast snapshot", () => {
    const result = runForecastModel({
      raceId: "race-3",
      asOf: "2026-07-28T12:00:00Z",
      candidates,
      previousElectionMargin: 0,
      districtPartisanLean: 0,
      electionEnvironment: 0,
      sourceUrls: ["https://example.com/source"],
      previousWinProbabilities: { "candidate-r": 0.5, "candidate-d": 0.5 },
    });

    expect(result.candidateProbabilities[0].winProbabilityChange).not.toBeNull();
    expect(result.candidateProbabilities[1].winProbabilityChange).not.toBeNull();
  });
});
