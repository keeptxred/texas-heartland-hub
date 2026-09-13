import { describe, expect, it } from "vitest";
import { storedHeroEditorialGuidance } from "./stored-hero-vision";
import type { SubjectExtract } from "./featured-image-core";

function subject(overrides: Partial<SubjectExtract> = {}): SubjectExtract {
  return {
    title: "Texas agency approves a new policy",
    firstParagraph: "The agency approved a new policy after a public meeting.",
    entities: ["Texas agency"],
    locations: ["Texas"],
    domain: "general",
    concreteSubject: "Texas agency approves a new policy. The agency is central to the story.",
    ...overrides,
  };
}

describe("stored hero representative-photo policy", () => {
  it("allows the central real entity without requiring an invisible action to be photographed", () => {
    const guidance = storedHeroEditorialGuidance(subject());
    expect(guidance).toContain("named person, organization, agency, institution, team, venue, product");
    expect(guidance).toContain("does not need to literally visualize");
    expect(guidance).toContain("Reject loose topical association");
  });

  it("allows truthful archive sports photography without requiring the exact game or roster action", () => {
    const guidance = storedHeroEditorialGuidance(subject({
      title: "Dallas Cowboys make three roster decisions",
      domain: "sports",
      concreteSubject: "Dallas Cowboys football roster story",
    }));
    expect(guidance).toContain("named team or athlete");
    expect(guidance).toContain("Do not require the exact historical game");
    expect(guidance).toContain("exact roster decision");
  });

  it("keeps data-center imagery on the strict visible-infrastructure rule", () => {
    const guidance = storedHeroEditorialGuidance(subject({
      title: "Texas data-center and electrical infrastructure",
      domain: "general",
      concreteSubject: "A visibly recognizable Texas data-center facility with industrial cooling equipment. A plain brick building does not qualify.",
    }));
    expect(guidance).toContain("STRICT DATA-CENTER STORED-HERO RULE");
    expect(guidance).toContain("industrial cooling equipment");
    expect(guidance).toContain("plain brick");
    expect(guidance).toContain("must fail");
  });
});
