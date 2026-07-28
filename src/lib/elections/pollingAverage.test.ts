import { describe, expect, it } from "vitest";
import type { ElectionPollSummary } from "@/types/elections";
import { calculatePollingAverage } from "./pollingAverage";

function poll(id: string, fieldEndDate: string, responses: readonly [string, string, number][]) {
  return {
    id,
    fieldEndDate,
    primaryQuestion: {
      responses: responses.map(([candidateId, candidateName, percentage]) => ({
        candidateId,
        candidateName,
        percentage,
      })),
    },
  } as ElectionPollSummary;
}

describe("polling average calculator", () => {
  it("calculates an equal-weight mean from published toplines", () => {
    const average = calculatePollingAverage([
      poll("poll-1", "2026-01-01", [["candidate-a", "Candidate A", 48]]),
      poll("poll-2", "2026-01-05", [["candidate-a", "Candidate A", 52]]),
    ]);
    expect(average?.candidates[0]).toMatchObject({
      candidateId: "candidate-a",
      averagePercentage: 50,
      pollCount: 2,
    });
    expect(average?.pollCount).toBe(2);
  });

  it("does not impute missing candidate percentages", () => {
    const average = calculatePollingAverage([
      poll("poll-1", "2026-01-01", [["candidate-a", "Candidate A", 48]]),
      {
        ...poll("poll-2", "2026-01-05", []),
        primaryQuestion: {
          responses: [
            {
              candidateId: "candidate-a",
              candidateName: "Candidate A",
              percentage: null,
            },
          ],
        },
      } as ElectionPollSummary,
    ]);
    expect(average?.candidates[0].averagePercentage).toBe(48);
    expect(average?.candidates[0].pollCount).toBe(1);
  });

  it("returns null without candidate toplines", () => {
    expect(calculatePollingAverage([])).toBeNull();
  });
});
