import { describe, expect, it } from "vitest";
import { editorialMinimumFor, validateArticle } from "./editorial-pipeline";

describe("editorial tiered word-count enforcement", () => {
  it("maps analysis categories to 1,200 words and breaking/general to 800", () => {
    expect(editorialMinimumFor("non-political")).toBe(1200);
    expect(editorialMinimumFor("business")).toBe(1200);
    expect(editorialMinimumFor("education")).toBe(1200);
    expect(editorialMinimumFor("sports")).toBe(1200);
    expect(editorialMinimumFor("politics")).toBe(800);
    expect(editorialMinimumFor(undefined)).toBe(800);
  });

  it("rejects an analysis-tier article that is below 1,200 main-story words", () => {
    const result = validateArticle(
      {
        title: "Texas schools post updated accountability ratings",
        summary:
          "Texas schools received updated accountability ratings after the state released new results, giving families and districts a fresh look at campus performance and year-over-year changes across the public education system.",
        sections: [
          {
            heading: "What changed in the ratings",
            paragraphs: [
              Array.from({ length: 350 }, (_, i) => `detail${i}`).join(" "),
            ],
          },
        ],
      },
      {
        hasClearNewsEvent: true,
        category: "education",
        primarySubject: "Texas schools",
      },
    );

    const tierReason = result.reasons.find((reason) => reason.startsWith("tiered_main_word_count:"));
    expect(tierReason).toMatch(/^tiered_main_word_count:\d+\/1200$/);
  });
});
