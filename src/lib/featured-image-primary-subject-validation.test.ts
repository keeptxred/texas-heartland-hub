import { describe, expect, it } from "vitest";
import { imageValidationDomainGuidance } from "./featured-image-cloudflare";
import type { Domain, SubjectExtract } from "./featured-image-core";

function subject(domain: Domain, title: string, concreteSubject: string): SubjectExtract {
  return {
    title,
    firstParagraph: concreteSubject,
    entities: [],
    locations: ["Texas"],
    domain,
    concreteSubject,
  };
}

describe("primary-subject image relevance guidance", () => {
  it("rejects association-only sports imagery for a football game story", () => {
    const guidance = imageValidationDomainGuidance(subject(
      "sports",
      "Texas A&M Dominates Missouri State in Season Opener",
      "Texas A&M football action in a season-opening game",
    ));

    expect(guidance).toContain("PRIMARY-SUBJECT RULE");
    expect(guidance).toContain("marching band");
    expect(guidance).toContain("stadium-only scene");
    expect(guidance).toContain("does NOT pass");
  });

  it("rejects generic cultural association when the defining subject is absent", () => {
    const guidance = imageValidationDomainGuidance(subject(
      "culture",
      "Texas Singer Releases Debut Album",
      "the named singer performing music",
    ));

    expect(guidance).toContain("named musicians");
    expect(guidance).toContain("generic city skyline");
    expect(guidance).toContain("instrument");
  });

  it("rejects an old disaster image for a current hurricane-risk outlook", () => {
    const guidance = imageValidationDomainGuidance(subject(
      "weather",
      "Texas Hurricane Odds Drop as El Nino Strengthens",
      "the current hurricane-season outlook and changing storm probabilities",
    ));

    expect(guidance).toContain("current official outlook");
    expect(guidance).toContain("historical disaster");
    expect(guidance).toContain("does not pass");
  });
});
