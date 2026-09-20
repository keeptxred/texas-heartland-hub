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

  it("accepts a full team name when the source contains its distinctive team alias", () => {
    const sportsArticle = {
      title: "Cowboys Prepare for Seahawks Matchup",
      summary:
        "The Dallas Cowboys are preparing to face the Seattle Seahawks in their upcoming matchup, with both teams entering the game focused on execution and preparation. The meeting gives Dallas another opportunity to evaluate its roster and approach against Seattle before the regular season schedule advances further.",
      relevance:
        "The Dallas Cowboys and Seattle Seahawks matchup matters to Texas football fans following both teams as they prepare for the next stage of the season.",
    };
    const sportsBrief: StoryBrief = {
      hasClearNewsEvent: true,
      primarySubject: "Dallas Cowboys",
      secondarySubjects: ["Seattle Seahawks"],
      relationships: [],
    };
    const source = "Cowboys vs Seahawks: what to know before the upcoming matchup.";
    const result = validateArticle(sportsArticle, sportsBrief, source);
    expect(result.reasons).not.toContain("unrelated_subject:Seattle Seahawks");
  });

  it("does not treat a shared city as support for a different organization", () => {
    const sportsArticle = {
      title: "Cowboys Prepare for Seattle Matchup",
      summary:
        "The Dallas Cowboys are preparing for their upcoming matchup while the Seattle Mariners were described as part of the same event. The Dallas organization is evaluating its approach and personnel before the schedule advances, giving Texas football fans a concrete update on the team's preparations.",
      relevance:
        "The Dallas Cowboys and Seattle Mariners were presented together in the draft even though the source does not support a connection between those organizations.",
    };
    const unsupportedBrief: StoryBrief = {
      hasClearNewsEvent: true,
      primarySubject: "Dallas Cowboys",
      secondarySubjects: ["Seattle Mariners"],
      relationships: [],
    };
    const source = "Cowboys vs Seahawks: what to know before the upcoming matchup in Seattle.";
    const result = validateArticle(sportsArticle, unsupportedBrief, source);
    expect(result.reasons).toContain("unrelated_subject:Seattle Mariners");
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
