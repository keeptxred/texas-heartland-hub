import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { ElectionResultSummary } from "@/types/elections";
import { ResultSummaryCard } from "./ResultSummaryCard";

describe("ResultSummaryCard", () => {
  it("renders every candidate result, including fourth and later candidates", () => {
    const candidates = ["Candidate One", "Candidate Two", "Candidate Three", "Candidate Four"].map(
      (ballotName, index) => ({
        candidateId: `candidate-${index + 1}`,
        ballotName,
        winnerStatus: "none",
        voteShare: null,
        votes: 0,
      }),
    );
    const result = {
      slug: "2026-us-senate",
      race: { name: "Texas U.S. Senate", officeName: "U.S. Senate" },
      status: "in_progress",
      certificationStatus: "pending",
      reporting: { reportingPercentage: 0 },
      reportingStatus: "partial",
      totalVotes: 0,
      candidates,
      updatedAt: "2026-11-03T20:00:00.000Z",
    } as unknown as ElectionResultSummary;

    const html = renderToStaticMarkup(<ResultSummaryCard result={result} />);
    for (const candidate of candidates) {
      expect(html).toContain(candidate.ballotName);
    }
    expect((html.match(/font-semibold text-foreground/g) ?? []).length).toBeGreaterThanOrEqual(candidates.length);
  });
});
