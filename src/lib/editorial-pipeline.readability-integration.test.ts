import { describe, expect, it } from "vitest";
import { validateArticle, type StoryBrief } from "./editorial-pipeline";

const brief: StoryBrief = {
  hasClearNewsEvent: true,
  primarySubject: "Texas officials",
  primaryEvent: "approved a statewide policy change",
};

const words = (count: number) => Array.from({ length: count }, (_, index) => `word${index + 1}`).join(" ");

describe("editorial readability gate integration", () => {
  it("blocks an otherwise valid draft with a wall-of-text section", () => {
    const result = validateArticle(
      {
        title: "Texas Officials Approve Statewide Policy Change",
        summary: "Texas officials approved a statewide policy change that updates how agencies will implement the program across the state. The action establishes the next step for state agencies and local governments, giving Texans a direct explanation of what changed, who is responsible for carrying it out, and why the decision matters now.",
        relevance: "The change affects Texans statewide because agencies and local governments will use the new policy when implementing the program.",
        sections: [{ heading: "What changes next", paragraphs: [`${words(220)}.`] }],
      },
      brief,
    );

    expect(result.ok).toBe(false);
    expect(result.reasons.some((reason) => reason.startsWith("readability_paragraph_too_long:"))).toBe(true);
  });
});
