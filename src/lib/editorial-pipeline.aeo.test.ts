import { describe, expect, it } from "vitest";
import { validateArticle, type StoryBrief } from "./editorial-pipeline";

const brief: StoryBrief = {
  hasClearNewsEvent: true,
  primarySubject: "Texas officials",
  primaryEvent: "approved a statewide policy change",
  locations: ["Texas"],
};

function articleWithSummary(summary: string) {
  return {
    title: "Texas Officials Approve Statewide Policy Change",
    summary,
    relevance:
      "The change affects Texans statewide because agencies and local governments will use the new policy when implementing the program.",
    sections: [
      {
        heading: "What changes next",
        paragraphs: [
          "State agencies will now move into implementation using the dates and requirements described in the official action. Local officials and affected residents will need to follow the published guidance as it becomes effective.",
        ],
      },
    ],
  };
}

describe("editorial AEO answer-first summaries", () => {
  it("accepts a self-contained direct answer summary", () => {
    const result = validateArticle(
      articleWithSummary(
        "Texas officials approved a statewide policy change that updates how the program will be implemented across the state. The action sets a clear next step for state agencies and local governments, giving Texans an immediate explanation of what changed, who is responsible for carrying it out, and why the decision matters now.",
      ),
      brief,
      "Texas officials approved a statewide policy change affecting implementation across Texas.",
    );

    expect(result.reasons).not.toContain("missing_direct_answer_summary");
    expect(result.reasons).not.toContain("direct_answer_summary_length");
    expect(result.reasons).not.toContain("generic_summary_opener");
  });

  it("rejects generic throat-clearing openings", () => {
    const result = validateArticle(
      articleWithSummary(
        "In a major development, Texas officials approved a statewide policy change that updates how the program will be implemented across the state. The action sets a clear next step for state agencies and local governments, giving Texans an immediate explanation of what changed, who is responsible for carrying it out, and why the decision matters now.",
      ),
      brief,
    );

    expect(result.reasons).toContain("generic_summary_opener");
  });

  it("rejects summaries that are too short for a standalone answer", () => {
    const result = validateArticle(
      articleWithSummary("Texas officials approved a statewide policy change affecting agencies and local governments."),
      brief,
    );

    expect(result.reasons).toContain("direct_answer_summary_length");
  });
});
