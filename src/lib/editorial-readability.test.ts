import { describe, expect, it } from "vitest";
import { validateArticleReadability } from "./editorial-readability";

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
