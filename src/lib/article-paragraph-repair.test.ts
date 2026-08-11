import { describe, expect, it } from "vitest";
import { dedupeArticleBody, repairParagraphStructure } from "./article-dedupe";

describe("article paragraph repair", () => {
  it("preserves explicit paragraph breaks as separate strings", () => {
    expect(repairParagraphStructure("First paragraph.\n\nSecond paragraph.\nThird paragraph.")).toEqual([
      "First paragraph.",
      "Second paragraph.",
      "Third paragraph.",
    ]);
  });

  it("splits oversized prose at sentence boundaries", () => {
    const sentence = "Central Texas restaurant rankings can shape where readers choose to eat when planning a trip through Austin and Lockhart.";
    const wall = Array.from({ length: 14 }, (_, index) => `${sentence} Entry ${index + 1} adds context.`).join(" ");
    const repaired = repairParagraphStructure(wall);

    expect(repaired.length).toBeGreaterThan(1);
    expect(repaired.join(" ")).toBe(wall);
  });

  it("repairs malformed intro and section strings before rendering", () => {
    const a = "Austin remains a major dining destination in Central Texas, with visitors comparing restaurants before deciding where to stop.";
    const b = "Lockhart also draws diners from across the state, making comparisons between the two places useful for trip planning.";
    const c = "Rankings can provide one perspective, while individual preferences still depend on menu choices, style, and timing.";
    const wall = Array.from({ length: 5 }, () => `${a} ${b} ${c}`).join(" ");
    const body = dedupeArticleBody({
      intro: [wall],
      sections: [{ heading: "How the destinations compare", paragraphs: [wall] }],
      faq: [],
      sources: [],
    });

    expect(body.intro && body.intro.length).toBeGreaterThan(1);
    expect(body.sections?.[0]?.paragraphs?.length).toBeGreaterThan(0);
  });

  it("leaves normal short paragraphs unchanged", () => {
    const paragraph = "Lockhart remains one of the best-known barbecue destinations in Texas.";
    expect(repairParagraphStructure(paragraph)).toEqual([paragraph]);
  });
});
