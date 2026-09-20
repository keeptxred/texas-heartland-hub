import { describe, expect, it } from "vitest";
import { imageValidationDomainGuidance } from "./featured-image-cloudflare";
import type { SubjectExtract } from "./featured-image-core";

const sportsSubject: SubjectExtract = {
  title: "Texas College Football Players Named to 2026 Ray Guy Award Watch List",
  firstParagraph: "Texas college football punters were named to a national award watch list.",
  entities: [],
  locations: ["Texas"],
  domain: "sports",
  concreteSubject: "Texas college football punters on a national award watch list",
};

describe("sports image validator guidance", () => {
  it("accepts representative anonymous exact-sport photography without requiring fabricated player likenesses", () => {
    const guidance = imageValidationDomainGuidance(sportsSubject);
    expect(guidance).toContain("do NOT require a recognizable likeness of a named athlete");
    expect(guidance).toContain("photorealistic anonymous athlete");
    expect(guidance).toContain("exact sport and relevant action");
    expect(guidance).toContain("Reject unrelated sports");
    expect(guidance).toContain("invented named-player likenesses");
  });
});
