import { describe, expect, it } from "vitest";
import { repairArticleReadability, validateArticleReadability } from "./editorial-readability";

const sentence = "Texas officials described the change and explained how it will affect residents across the state in the months ahead.";

describe("repairArticleReadability", () => {
  it("splits embedded blank-line paragraphs without changing their wording", () => {
    const article = { sections: [{ heading: "What changed", paragraphs: ["First paragraph stays intact.\n\nSecond paragraph stays intact."] }] };
    const repaired = repairArticleReadability(article);
    expect(repaired.sections[0].paragraphs).toEqual(["First paragraph stays intact.", "Second paragraph stays intact."]);
  });

  it("splits oversized prose at sentence boundaries", () => {
    const wall = Array.from({ length: 18 }, () => sentence).join(" ");
    const article = { sections: [{ heading: "What changed", paragraphs: [wall] }] };
    const repaired = repairArticleReadability(article);
    expect(repaired.sections[0].paragraphs.length).toBeGreaterThan(1);
    expect(repaired.sections[0].paragraphs.join(" ")).toBe(wall);
    expect(validateArticleReadability(repaired).some((reason) => reason.includes("paragraph_too_long"))).toBe(false);
  });

  it("leaves already-readable structured articles unchanged", () => {
    const article = { sections: [{ heading: "What changed", paragraphs: ["A concise first paragraph explains the event.", "A concise second paragraph explains what happens next."] }] };
    expect(repairArticleReadability(article)).toBe(article);
  });

  it("does not split structural list blocks", () => {
    const list = `- ${Array.from({ length: 170 }, () => "item").join(" ")}`;
    const article = { sections: [{ heading: "Key points", paragraphs: [list] }] };
    expect(repairArticleReadability(article)).toBe(article);
  });
});
