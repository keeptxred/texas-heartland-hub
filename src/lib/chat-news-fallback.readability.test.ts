import { describe, expect, it } from "vitest";
import { repairArticleReadability } from "./editorial-readability";

describe("historical newsroom paragraph backfill shape", () => {
  it("repairs the exact one-section one-paragraph shape used by historical SQL newsroom articles", () => {
    const first = "The first paragraph explains the event and keeps every original word intact.";
    const second = "The second paragraph explains the response and also keeps every original word intact.";
    const rawBody = `${first}\n\n${second}`;
    const malformed = {
      updated: "2026-08-09",
      intro: [first],
      sections: [{ heading: "The story", paragraphs: [rawBody] }],
      faq: [],
      sources: [{ label: "Source", url: "https://example.com" }],
    };

    const repaired = repairArticleReadability(malformed);
    expect(repaired.sections[0].paragraphs).toEqual([first, second]);
    expect(repaired.sections[0].paragraphs?.join("\n\n")).toBe(rawBody);
    expect(repaired.updated).toBe(malformed.updated);
    expect(repaired.intro).toEqual(malformed.intro);
    expect(repaired.sources).toEqual(malformed.sources);
  });
});
