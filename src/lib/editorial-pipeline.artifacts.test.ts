import { describe, expect, it } from "vitest";
import { validateArticle } from "./editorial-pipeline";

const clean = {
  title: "Thompson says she has support for Texas House speaker",
  summary: "Texas state Rep. Senfronia Thompson said she has the votes to become speaker when the state House convenes in January. Lawmakers must still cast the formal vote, and endorsements are not a substitute for the chamber's recorded decision.",
  sections: [
    {
      heading: "Lawmakers discuss the speaker election",
      paragraphs: [
        "Thompson announced support for her candidacy and discussed the upcoming legislative process. The actual speaker vote remains scheduled for the next session.",
      ],
    },
  ],
};

describe("newsroom model-output artifact rejection", () => {
  it("rejects leaked Python dictionary/list structures even if they inflate the word floor", () => {
    const draft = {
      ...clean,
      sections: [
        {
          heading: "Thompson's announcement",
          paragraphs: [
            "Eddie Morales endorsed her.', 'The speaker will be chosen in January.', 'Lawmakers still must vote.']}, {'heading': 'Historic Significance', 'paragraphs': ['If elected, she would make history.",
            "Additional facts.}], {'heading': 'Committee assignments', 'paragraphs': ['The speaker appoints committees.",
          ],
        },
      ],
    };
    expect(validateArticle(draft).reasons).toContain("generated_draft_artifact:section_1_paragraph_1");
  });

  it("rejects instruction commentary embedded in public-facing article paragraphs", () => {
    const draft = {
      ...clean,
      sections: [{
        heading: "The vote",
        paragraphs: ["The paragraphs are merged into the first section for better readability as per instructions, but additional sections are added below to meet the requirements of 4-6 sections."],
      }],
    };
    expect(validateArticle(draft).reasons).toContain("generated_draft_artifact:section_1_paragraph_1");
  });

  it("does not flag ordinary factual paragraphs and source names", () => {
    const result = validateArticle(clean);
    expect(result.reasons.filter((reason) => reason.startsWith("generated_draft_artifact:"))).toEqual([]);
  });
});
