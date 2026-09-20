import { describe, expect, it } from "vitest";
import { buildImagePrompt, buildNegativeImagePrompt, inferDomain, type SubjectExtract } from "./featured-image-core";

function sportsSubject(title: string): SubjectExtract {
  return {
    title,
    firstParagraph: title,
    entities: [],
    locations: ["Texas"],
    domain: inferDomain(title),
    concreteSubject: title,
  };
}

describe("sports image grounding", () => {
  it.each([
    "Texas colleges announce 2026 cross country schedules",
    "Texas college football punters named to Ray Guy Award watch list",
    "Texas A&M track and field athletes prepare for championship meet",
  ])("classifies %s as sports before generic education", (title) => {
    expect(inferDomain(title)).toBe("sports");
  });

  it("forces cross-country coverage into real sports photojournalism", () => {
    const subject = sportsSubject("Texas colleges announce 2026 cross country schedules");
    const prompt = buildImagePrompt(subject);
    expect(prompt).toContain("REAL SPORTS PHOTOJOURNALISM PHOTOGRAPH ONLY");
    expect(prompt).toContain("cross-country coverage must show believable distance runners");
    expect(prompt).toContain("never concept art or promotional artwork");
  });

  it("forces punting coverage into believable football action without logos", () => {
    const subject = sportsSubject("Texas college football players named to 2026 Ray Guy Award watch list");
    const prompt = buildImagePrompt(subject);
    const negative = buildNegativeImagePrompt(subject);
    expect(prompt).toContain("punting coverage must show a believable football punter");
    expect(negative).toContain("school logo");
    expect(negative).toContain("invented named athlete likeness");
  });
});
