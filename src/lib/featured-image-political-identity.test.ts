import { describe, expect, it } from "vitest";
import {
  buildImagePrompt,
  buildNegativeImagePrompt,
  inferArticleImageDomain,
  type SubjectExtract,
} from "./featured-image-core";

describe("Texas political-identity image routing", () => {
  it("keeps Texas Republican identity coverage in politics even when cultural issues are discussed", () => {
    const domain = inferArticleImageDomain(
      "What does it mean to be a Texas Republican in 2026?",
      "The Texas Republican Party coalition has shifted, with a stronger emphasis on cultural and social issues.",
    );

    expect(domain).toBe("politics");
  });

  it("also recognizes Democratic Party identity coverage without swallowing ordinary culture stories", () => {
    expect(inferArticleImageDomain(
      "How the Texas Democratic Party coalition is changing",
      "Party identity, platform and primary voters are changing across Texas.",
    )).toBe("politics");
    expect(inferArticleImageDomain(
      "Texas cultural festival returns this fall",
      "The heritage festival will feature music, food and museum programming.",
    )).toBe("culture");
  });

  it("uses an anonymous civic organizing scene and explicit anti-likeness constraints for party identity", () => {
    const subject: SubjectExtract = {
      title: "What does it mean to be a Texas Republican in 2026?",
      firstParagraph: "The Texas Republican Party coalition has shifted, with a stronger emphasis on cultural and social issues.",
      entities: ["Texas Republican Party"],
      locations: ["Texas"],
      domain: "politics",
      concreteSubject: "Texas Republican Party identity and coalition change.",
    };

    const prompt = buildImagePrompt(subject);
    const negative = buildNegativeImagePrompt(subject);

    expect(prompt).toContain("REAL POLITICAL NEWS PHOTOGRAPH ONLY");
    expect(prompt).toContain("anonymous Texas grassroots political-organizing or primary-election setting");
    expect(prompt).toContain("ordinary county meeting room or civic hall");
    expect(prompt).toContain("No recognizable politician or named-person likeness");
    expect(negative).toContain("recognizable politician");
    expect(negative).toContain("party logo");
    expect(negative).toContain("generic flag-only symbolism");
  });
});
