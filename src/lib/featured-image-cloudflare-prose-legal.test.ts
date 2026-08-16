import { describe, expect, it } from "vitest";
import { buildImagePrompt, buildNegativeImagePrompt, inferDomain, parseVisionVerdict, type SubjectExtract } from "./featured-image.functions";

const legalSubject: SubjectExtract = {
  title: "Texas Court Upholds Election Integrity Law Amid Democratic Challenges",
  firstParagraph: "A Texas appellate court upheld an election law after a legal challenge.",
  entities: [],
  locations: ["Texas"],
  domain: "legal",
  concreteSubject: "A Texas appellate-court ruling on an election-law challenge.",
};

describe("Cloudflare featured-image vision resilience", () => {
  it("uses a plain-English Cloudflare rejection as a negative verdict", () => {
    const verdict = parseVisionVerdict(
      "The image does not match the story, as it depicts a man in a suit holding a flagpole in front of a domed government building.",
    );
    expect(verdict).not.toBeNull();
    expect(verdict?.matches).toBe(false);
    expect(verdict?.reason).toContain("does not match the story");
  });

  it("parses the markdown-style verdict Cloudflare actually returns", () => {
    const verdict = parseVisionVerdict(
      "**Image Evaluation** * **Matches**: False, the image does not clearly depict a Texas courthouse. * **Photorealistic**: False, the image appears to be an illustration.",
    );
    expect(verdict?.matches).toBe(false);
    expect(verdict?.photorealistic).toBe(false);
  });

  it("accepts an unambiguous plain-English approval when JSON mode is not followed", () => {
    const verdict = parseVisionVerdict(
      "The photograph clearly matches the story and is photorealistic, showing a believable courthouse scene tied directly to the ruling.",
    );
    expect(verdict).toEqual({
      matches: true,
      photorealistic: true,
      reason: "The photograph clearly matches the story and is photorealistic, showing a believable courthouse scene tied directly to the ruling.",
    });
  });

  it("classifies court rulings as legal before generic politics", () => {
    expect(inferDomain("Texas court upholds election law after an appellate ruling")).toBe("legal");
  });

  it("steers legal stories toward real courthouse photography and away from symbolic graphics", () => {
    const prompt = buildImagePrompt(legalSubject);
    expect(prompt).toContain("real courthouse exterior or courtroom interior");
    expect(prompt).toContain("Do not use a politician");
    expect(prompt).toContain("flagpole");
    expect(prompt).toContain("capitol dome");
    expect(prompt).toContain("Texas-shaped graphic");
    expect(prompt).toContain("documentary photojournalism");
  });

  it("uses negative prompting to reject illustration and Texas-map motifs", () => {
    const negative = buildNegativeImagePrompt(
      legalSubject,
      "The image appears to be an illustration or graphic representation of the state of Texas.",
    );
    expect(negative).toContain("illustration");
    expect(negative).toContain("Texas state silhouette");
    expect(negative).toContain("map of Texas");
    expect(negative).toContain("rejected visual motif");
  });

  it("puts retry feedback ahead of the primary subject so correction survives prompt truncation", () => {
    const correction = "REJECTED MOTIF: politician with flagpole in front of a dome";
    const prompt = buildImagePrompt(legalSubject, correction);
    expect(prompt.indexOf(correction)).toBeGreaterThanOrEqual(0);
    expect(prompt.indexOf(correction)).toBeLessThan(prompt.indexOf("PRIMARY SUBJECT"));
    expect(prompt.slice(0, 2048)).toContain(correction);
  });
});