import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { CandidateSummary, ElectionForecastDetail } from "@/types/elections";
import { findCandidateDuplicates, validateForecast, validatePublicSourceUrl } from "./electionQa";
import { ELECTION_PRIMARY_NAVIGATION, ELECTION_PRIMARY_NAV_ROUTES } from "./routes";

describe("Election Central launch QA", () => {
  it("keeps every primary navigation link in the declared route set", () => {
    expect(
      ELECTION_PRIMARY_NAVIGATION.every((item) => ELECTION_PRIMARY_NAV_ROUTES.includes(item.href)),
    ).toBe(true);
  });

  it("retains mobile overflow and touch-target protections in primary navigation", () => {
    const source = readFileSync(
      "src/components/elections/navigation/ElectionNavigation.tsx",
      "utf8",
    );
    expect(source).toContain("overflow-x-auto");
    expect(source).toContain("min-w-max");
    expect(source).toContain("min-h-10");
  });

  it("flags duplicate candidates only within the same race", () => {
    const candidates = [
      candidate("one", "Jane Doe", "race-1"),
      candidate("two", "Jane Doe", "race-1"),
      candidate("three", "Jane Doe", "race-2"),
    ];
    expect(findCandidateDuplicates(candidates)).toHaveLength(1);
  });

  it("requires valid forecast ranges and sourced fundamentals", () => {
    const forecast = {
      id: "forecast-1",
      model: { model: "fundamentals", fundamentals: null },
      candidateSummaries: [
        { candidateId: "candidate-1", candidateName: "Candidate", winProbability: 101 },
      ],
    } as ElectionForecastDetail;
    expect(validateForecast(forecast).map((issue) => issue.code)).toEqual([
      "forecast_probability_range",
      "forecast_fundamentals_missing",
    ]);
  });

  it("accepts only valid HTTPS public source links", () => {
    expect(validatePublicSourceUrl("https://www.sos.state.tx.us/elections/")).toBeNull();
    expect(validatePublicSourceUrl("http://example.test")).toMatchObject({
      code: "source_not_https",
    });
    expect(validatePublicSourceUrl("not a URL")).toMatchObject({ code: "source_invalid_url" });
  });
});

function candidate(id: string, fullName: string, raceId: string) {
  return { id, fullName, primaryRace: { id: raceId } } as CandidateSummary;
}
