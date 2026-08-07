import { describe, expect, it } from "vitest";
import { validateArticle, type StoryBrief } from "./editorial-pipeline";

const article = {
  title: "Governor Abbott Announces QTS Data Centers Will Meet Texas Standards",
  summary:
    "Governor Greg Abbott announced that QTS Data Centers will meet new Texas standards as the company expands major data-center operations in the state. The announcement addresses infrastructure expectations, power reliability, and the state's requirements for large computing facilities, giving Texans a concrete update on how the project will proceed.",
  relevance:
    "The decision matters in Texas because large data centers can affect power demand, infrastructure planning, and economic development across the communities where they operate.",
};

const brief: StoryBrief = {
  hasClearNewsEvent: true,
  primarySubject: "Governor Greg Abbott",
  secondarySubjects: ["QTS Data Centers"],
  relationships: [],
};

describe("editorial source-supported subjects", () => {
  it("does not reject a secondary subject explicitly named in the source", () => {
    const source =
      "Governor Abbott Announces QTS Data Centers Will Meet Texas Standards. QTS Data Centers will meet Texas standards under the announcement from the Office of the Governor.";
    const result = validateArticle(article, brief, source);
    expect(result.reasons).not.toContain("unrelated_subject:QTS Data Centers");
  });

  it("still rejects a subject that is not in the source and lacks a relationship", () => {
    const unsupportedBrief: StoryBrief = {
      ...brief,
      secondarySubjects: ["Unrelated Cloud Company"],
    };
    const unsupportedArticle = {
      ...article,
      summary:
        "Governor Greg Abbott announced Texas data-center standards while Unrelated Cloud Company was described as participating in the same initiative. The announcement addresses infrastructure expectations, power reliability, and statewide requirements for large computing facilities, giving Texans a concrete update on how the project will proceed.",
    };
    const result = validateArticle(unsupportedArticle, unsupportedBrief, "Governor Abbott announced Texas data-center standards.");
    expect(result.reasons).toContain("unrelated_subject:Unrelated Cloud Company");
  });
});
