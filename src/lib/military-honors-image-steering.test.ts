import { describe, expect, it } from "vitest";
import { buildImagePrompt, buildNegativeImagePrompt, inferDomain } from "./featured-image-core";

describe("military honors image steering", () => {
  const subject = {
    title: "Governor marks Purple Heart Day in Texas",
    firstParagraph: "Texas recognizes wounded service members and Purple Heart recipients.",
    entities: ["Purple Heart"],
    locations: ["Texas"],
    domain: "military" as const,
    concreteSubject: "Purple Heart Day recognition honoring wounded service members",
  };

  it("classifies honors language as military before politics", () => {
    expect(inferDomain("Governor marks Purple Heart Day for Texas veterans")).toBe("military");
  });

  it("centers the named honor rather than generic political or military imagery", () => {
    const prompt = buildImagePrompt(subject);
    expect(prompt).toContain("MILITARY HONORS OVERRIDE");
    expect(prompt).toContain("Make the named medal, decoration, folded flag, memorial, or remembrance subject dominate the frame");
    expect(prompt).toContain("Do not center a politician");
  });

  it("adds military-honors-specific negative motifs", () => {
    const negative = buildNegativeImagePrompt(subject);
    expect(negative).toContain("press conference");
    expect(negative).toContain("generic military base");
    expect(negative).toContain("unrelated combat");
  });
});
