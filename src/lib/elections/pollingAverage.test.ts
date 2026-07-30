import { describe, expect, it } from "vitest";
import type { ElectionPollSummary } from "@/types/elections";
import { calculatePollingAverage } from "./pollingAverage";

function poll(
  id: string,
  fieldEndDate: string,
  responses: readonly [string, string, number | null][],
  overrides: Partial<ElectionPollSummary> = {},
) {
  return {
    id,
    status: "published",
    pollsterName: `Pollster ${id}`,
    pollsterGrade: "b",
    fieldStartDate: fieldEndDate,
    fieldEndDate,
    methodology: {
      population: "likely_voters",
      sampleSize: 600,
      marginOfError: 4,
      confidenceLevel: 0.95,
      mode: "mixed_mode",
      languages: ["English"],
      weightingDescription: "Weighted to the electorate.",
      samplingDescription: null,
      likelyVoterModelDescription: null,
      questionOrderRandomized: null,
      includesCellPhones: true,
      responseRate: null,
      methodologyUrl: "https://example.com/methodology",
    },
    sponsors: [],
    internalPoll: false,
    partisanPoll: false,
    trackingPoll: false,
    primaryQuestion: {
      responses: responses.map(([candidateId, candidateName, percentage]) => ({
        candidateId,
        candidateName,
        percentage,
      })),
    },
    ...overrides,
  } as unknown as ElectionPollSummary;
}

describe("polling average calculator", () => {
  it("gives greater influence to a newer, larger, higher-quality poll", () => {
    const average = calculatePollingAverage(
      [
        poll("older", "2026-06-01", [["candidate-a", "Candidate A", 44]], {
          pollsterGrade: "c",
          methodology: {
            ...poll("base", "2026-06-01", []).methodology,
            sampleSize: 400,
            population: "registered_voters",
            mode: "automated_phone",
          },
        }),
        poll("newer", "2026-07-20", [["candidate-a", "Candidate A", 52]], {
          pollsterGrade: "a",
          methodology: {
            ...poll("base", "2026-07-20", []).methodology,
            sampleSize: 1_200,
          },
        }),
      ],
      { asOf: "2026-07-21T12:00:00Z" },
    );

    expect(average?.candidates[0].averagePercentage).toBeGreaterThan(49);
    expect(average?.pollCount).toBe(2);
    expect(average?.pollWeights).toHaveLength(2);
    expect(average?.pollWeights[1].finalWeight).toBeGreaterThan(
      average?.pollWeights[0].finalWeight ?? 0,
    );
  });

  it("reports weighted margin, uncertainty, dates, and recalculation time", () => {
    const average = calculatePollingAverage(
      [
        poll("poll-1", "2026-07-10", [
          ["candidate-a", "Candidate A", 49],
          ["candidate-b", "Candidate B", 45],
        ]),
        poll("poll-2", "2026-07-15", [
          ["candidate-a", "Candidate A", 51],
          ["candidate-b", "Candidate B", 44],
        ]),
      ],
      { asOf: "2026-07-16T12:00:00Z" },
    );

    expect(average?.weightedMargin).toBeGreaterThan(4);
    expect(average?.uncertaintyRange).not.toBeNull();
    expect(average?.fieldDateFrom).toBe("2026-07-10");
    expect(average?.fieldDateTo).toBe("2026-07-15");
    expect(average?.recalculatedAt).toBe("2026-07-16T12:00:00.000Z");
  });

  it("does not impute missing candidate percentages", () => {
    const average = calculatePollingAverage(
      [
        poll("poll-1", "2026-07-01", [["candidate-a", "Candidate A", 48]]),
        poll("poll-2", "2026-07-05", [["candidate-a", "Candidate A", null]]),
      ],
      { asOf: "2026-07-06T12:00:00Z" },
    );
    expect(average?.candidates[0].averagePercentage).toBe(48);
    expect(average?.candidates[0].pollCount).toBe(1);
  });

  it("returns null without candidate toplines", () => {
    expect(calculatePollingAverage([], { asOf: "2026-07-01T12:00:00Z" })).toBeNull();
  });
});
