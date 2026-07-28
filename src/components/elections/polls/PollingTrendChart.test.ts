import { describe, expect, it } from "vitest";
import { buildPollingTrend } from "@/lib/elections/pollingTrend";
import type { ElectionPollSummary } from "@/types/elections";

describe("buildPollingTrend", () => {
  it("uses only supplied published toplines and orders them by field date", () => {
    const newer = poll("poll-2", "2026-05-12", 48);
    const older = poll("poll-1", "2026-05-01", 46);

    expect(buildPollingTrend([newer, older])).toEqual({
      candidates: [{ key: "candidate_candidate_1", name: "Candidate One" }],
      points: [
        {
          date: "2026-05-01",
          pollster: "Public Pollster",
          candidate_candidate_1: 46,
        },
        {
          date: "2026-05-12",
          pollster: "Public Pollster",
          candidate_candidate_1: 48,
        },
      ],
    });
  });

  it("does not create points for polls without candidate percentages", () => {
    const item = poll("poll-1", "2026-05-01", null);
    expect(buildPollingTrend([item])).toEqual({ candidates: [], points: [] });
  });
});

function poll(id: string, fieldEndDate: string, percentage: number | null) {
  return {
    id,
    pollsterName: "Public Pollster",
    fieldEndDate,
    primaryQuestion: {
      responses: [
        {
          candidateId: "candidate-1",
          candidateName: "Candidate One",
          percentage,
        },
      ],
    },
  } as unknown as ElectionPollSummary;
}
