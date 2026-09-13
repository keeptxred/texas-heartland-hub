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
    expect(guidance).toContain("trusted reusable-source metadata");
    expect(guidance).toContain("Metadata can establish identity, not visual type or semantic relevance");
  });

  it("allows source-identified archive sports photography without requiring logos or exact game action", () => {
    const guidance = storedHeroEditorialGuidance(subject({
      title: "Texas A&M dominates Missouri State in season opener",
      domain: "sports",
      concreteSubject: "Texas A&M football result story",
    }));
    expect(guidance).toContain("named team or athlete");
    expect(guidance).toContain("Do not require the exact historical game");
    expect(guidance).toContain("trusted reusable-source metadata");
    expect(guidance).toContain("do not require the vision model to rediscover a team from logos, colors, jersey text, or facial recognition");
  });

  it("allows a source-identified central person in a data-center story while keeping facility imagery strict", () => {
    const guidance = storedHeroEditorialGuidance(subject({
      title: "Charley Crockett’s Texas Data-Center Post Sets Off a Social-Media Dispute",
      domain: "general",
      concreteSubject: "A stored photo can depict the central named person or visibly recognizable data-center infrastructure. A plain brick building does not qualify merely by metadata.",
    }));
    expect(guidance).toContain("DATA-CENTER STORED-HERO RULE");
    expect(guidance).toContain("PATH A — CENTRAL ENTITY");
    expect(guidance).toContain("PATH B — PHYSICAL INFRASTRUCTURE");
    expect(guidance).toContain("treat that exact identity as established");
    expect(guidance).toContain("industrial cooling equipment");
    expect(guidance).toContain("plain brick");
    expect(guidance).toContain("must fail under PATH B");
  });

  it("does not let trusted metadata turn a generic facility into a data-center match", () => {
    const guidance = storedHeroEditorialGuidance(subject({
      title: "Texas Data Center Grid Requests Under Audit",
      domain: "general",
      concreteSubject: "A data-center facility or grid-infrastructure scene with visible physical cues.",
    }));
    expect(guidance).toContain("cannot turn the wrong visual type or a generic facility scene into a PATH B match");
    expect(guidance).toContain("no visible data-center infrastructure must fail");
  });
});
