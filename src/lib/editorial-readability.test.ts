import { describe, expect, it } from "vitest";
import { repairArticleReadability, validateArticleReadability } from "./editorial-readability";

const words = (count: number) => Array.from({ length: count }, (_, index) => `word${index + 1}`).join(" ");

describe("article readability validation", () => {
  it("accepts a normally structured article", () => {
    const reasons = validateArticleReadability({
      summary: `${words(55)}.`,
      relevance: `${words(70)}.`,
      sections: [
        { heading: "What changes next", paragraphs: [`${words(85)}.`, `${words(65)}.`] },
        { heading: "Why it matters in Texas", paragraphs: [`${words(90)}.`, `${words(60)}.`] },
      ],
    });

    expect(reasons).toEqual([]);
  });

  it("repairs 8-sentence, 136-word paragraphs rejected by the validator without changing wording", () => {
    const original = Array.from({ length: 8 }, (_, i) => `Item ${i + 1} ${words(15)}.`).join(" ");
    const article = {
      summary: `${words(55)}.`,
      sections: [
        { heading: "What happened", paragraphs: [original] },
        { heading: "Why it matters", paragraphs: [`${words(82)}.`] },
      ],
    };
    expect(original.split(/\s+/)).toHaveLength(136);
    expect(validateArticleReadability(article)).toContain("readability_paragraph_too_many_sentences:section_1_paragraph_1:8");
    const repaired = repairArticleReadability(article);
    expect(repaired.sections[0].paragraphs.length).toBeGreaterThanOrEqual(2);
    expect(repaired.sections[0].paragraphs.join(" ")).toBe(original);
    expect(validateArticleReadability(repaired)).toEqual([]);
    // Each generated paragraph is a purely structural subdivision. No
    // invented words, deleted facts, or lower editorial validation thresholds.
  });

  it("never recombines a short tail into an invalid 6-sentence paragraph", () => {
    const original = [
      ...Array.from({ length: 4 }, (_, i) => `Earlier ${i + 1} ${words(26)}.`),
      ...Array.from({ length: 2 }, (_, i) => `Later ${i + 1} ${words(10)}.`),
    ].join(" ");
    const article = {
      sections: [
        { heading: "What happened", paragraphs: [original] },
        { heading: "Why it matters", paragraphs: [`${words(72)}.`] },
      ],
    };
    const repaired = repairArticleReadability(article);
    expect(repaired.sections[0].paragraphs.join(" ")).toBe(original);
    expect(repaired.sections[0].paragraphs.length).toBeGreaterThanOrEqual(2);
    expect(validateArticleReadability(repaired)).toEqual([]);
  });

  it("rejects an extreme wall-of-text paragraph", () => {
    const reasons = validateArticleReadability({
      summary: `${words(55)}.`,
      sections: [{ heading: "What happened", paragraphs: [`${words(220)}.`] }],
    });

    expect(reasons.some((reason) => reason.startsWith("readability_paragraph_too_long:"))).toBe(true);
  });

  it("rejects embedded blank-line paragraphs stored in one array item", () => {
    const reasons = validateArticleReadability({
      summary: `${words(55)}.`,
      sections: [
        {
          heading: "What happened",
          paragraphs: [`${words(60)}.\n\n${words(60)}.`],
        },
      ],
    });

    expect(reasons).toContain("readability_embedded_paragraph_break:section_1_paragraph_1");
  });

  it("requires useful sectioning for long stories", () => {
    const reasons = validateArticleReadability({
      summary: `${words(80)}.`,
      relevance: `${words(100)}.`,
      sections: [{ heading: "What happened", paragraphs: Array.from({ length: 7 }, () => `${words(80)}.`) }],
    });

    expect(reasons.some((reason) => reason.startsWith("readability_too_few_sections:"))).toBe(true);
  });

  it("normalizes generic section headings without discarding valid prose", () => {
    const article = {
      summary: `${words(55)}.`,
      sections: [{ heading: "The story", paragraphs: [`${words(70)}.`] }],
    };

    const reasons = validateArticleReadability(article);

    expect(reasons).not.toContain("readability_generic_section_heading:1");
    expect(article.sections[0].heading).toBe("What happened");
  });
});
