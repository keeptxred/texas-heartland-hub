import { describe, expect, it } from "vitest";
import { storedHeroEditorialGuidance, storedHeroPolicyCorrection } from "./stored-hero-vision";
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
    expect(guidance).toContain("PRIMARY-SUBJECT PRIORITY");
    expect(guidance).toContain("same-domain setting must fail");
  });

  it("requires named-person stories to beat generic domain context", () => {
    const guidance = storedHeroEditorialGuidance(subject({
      title: "Houston anchor returns after station review",
      domain: "culture",
      concreteSubject: "A named television anchor is the defining subject of the story.",
    }));
    expect(guidance).toContain("headline foregrounds one or more named people");
    expect(guidance).toContain("generic TV studio, control room");
    expect(guidance).toContain("must fail");
  });

  it("allows a source-identified named person to represent a legal story", () => {
    const guidance = storedHeroEditorialGuidance(subject({
      title: "James Harden’s Houston Gun Charge Dismissed After Alternative Resolution Program",
      domain: "legal",
      concreteSubject: "James Harden is the headline-defining named person in the legal story.",
    }));
    expect(guidance).toContain("named person who is central to the case or headline");
    expect(guidance).toContain("trusted reusable-source metadata explicitly identifies the visible named person");
    expect(guidance).toContain("generic TV studio, control room, capitol, courthouse");
  });

  it("requires specific products and events to beat brand-only association", () => {
    const guidance = storedHeroEditorialGuidance(subject({
      title: "Texas brand launches a specific co-branded shirt",
      domain: "culture",
      concreteSubject: "The specific merchandise item is the defining visual subject.",
    }));
    expect(guidance).toContain("SPECIFIC-VISUAL PRIORITY");
    expect(guidance).toContain("specific product, merchandise item, opening, performance, festival, incident");
    expect(guidance).toContain("generic brand storefront");
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
    expect(guidance).toContain("marching band, mascot, stadium-only, or crowd-only");
  });

  it("retries a sports verdict that wrongly demands the exact historical game", () => {
    const correction = storedHeroPolicyCorrection(
      subject({
        title: "Bills Beat Texans 36-31 After Late Josh Allen Touchdown and Stroud Fumble",
        domain: "sports",
        entities: ["Houston Texans"],
        concreteSubject: "Houston Texans football game-result story.",
      }),
      {
        candidateAltText: "Houston Texans football players in an on-field huddle",
        sourceMetadata: "File: Houston Texans players 2006-09-10.jpg",
      },
      "The image shows Houston Texans players, but the specific 2026 game mentioned in the article is not depicted.",
    );
    expect(correction).toContain("Do not require the exact game");
  });

  it("retries a legal verdict that wrongly forces a courthouse over the named person", () => {
    const correction = storedHeroPolicyCorrection(
      subject({
        title: "James Harden’s Houston Gun Charge Dismissed After Alternative Resolution Program",
        domain: "legal",
        entities: ["James Harden"],
        concreteSubject: "James Harden is the headline-defining named person.",
      }),
      {
        candidateAltText: "Archive photograph of James Harden playing basketball for Team USA in 2012",
        sourceMetadata: "File: James Harden dunk vs Dominican Republic 2012.jpg",
      },
      "The image shows James Harden playing basketball, which is not directly relevant to the legal story; the primary subject should depict a courthouse.",
    );
    expect(correction).toContain("headline-defining named person");
    expect(correction).toContain("Do not require a courthouse");
  });

  it("does not retry a generic candidate with no story-entity identity match", () => {
    const correction = storedHeroPolicyCorrection(
      subject({
        title: "Bills Beat Texans 36-31",
        domain: "sports",
        entities: ["Houston Texans"],
      }),
      {
        candidateAltText: "Generic football stadium",
        sourceMetadata: "File: Generic stadium.jpg",
      },
      "The specific game is not depicted.",
    );
    expect(correction).toBeNull();
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
