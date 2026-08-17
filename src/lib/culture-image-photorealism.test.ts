import { describe, expect, it } from "vitest";
import { buildImagePrompt, buildNegativeImagePrompt, type SubjectExtract } from "./featured-image-core";

const subject: SubjectExtract = {
  title: "Texas Pickle Festival Moves to Helotes",
  firstParagraph: "Organizers are moving the festival to the Helotes Festival Grounds.",
  entities: ["Texas Pickle Festival", "Helotes Festival Grounds"],
  locations: ["Helotes"],
  domain: "culture",
  concreteSubject: "Texas Pickle Festival moving to the Helotes Festival Grounds",
};

describe("culture image photorealism steering", () => {
  it("forces festival coverage into documentary photography rather than promotional graphics", () => {
    const prompt = buildImagePrompt(subject);
    expect(prompt).toContain("REAL DOCUMENTARY PHOTOGRAPH ONLY");
    expect(prompt).toContain("unedited newspaper photograph");
    expect(prompt).toContain("Absolutely no event flyer");
    expect(prompt).toContain("rather than inventing a packed crowd");
  });

  it("adds culture-specific promotional-art motifs to the negative prompt", () => {
    const negative = buildNegativeImagePrompt(subject, "graphic design with text overlay");
    expect(negative).toContain("event flyer");
    expect(negative).toContain("promotional graphic");
    expect(negative).toContain("readable signage");
    expect(negative).toContain("rejected visual motif: graphic design with text overlay");
  });
});
