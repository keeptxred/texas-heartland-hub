import { describe, expect, it } from "vitest";
import { buildImagePrompt, inferDomain, parseVisionVerdict, type SubjectExtract } from "./featured-image.functions";

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

  it("steers legal stories away from politician, flagpole, and capitol imagery", () => {
    const prompt = buildImagePrompt(legalSubject);
    expect(prompt).toContain("believable Texas courthouse exterior or courtroom interior");
    expect(prompt).toContain("Do not use a politician");
    expect(prompt).toContain("flagpole");
    expect(prompt).toContain("capitol dome");
  });

  it("puts retry feedback ahead of the primary subject so the 2048-character model cap retains it", () => {
    const correction = "REJECTED MOTIF: politician with flagpole in front of a dome";
    const prompt = buildImagePrompt(legalSubject, correction);
    expect(prompt.indexOf(correction)).toBeGreaterThanOrEqual(0);
    expect(prompt.indexOf(correction)).toBeLessThan(prompt.indexOf("PRIMARY SUBJECT"));
    expect(prompt.slice(0, 2048)).toContain(correction);
  });
});
