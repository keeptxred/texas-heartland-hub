import { describe, expect, it } from "vitest";
import { normalizeNewsroomDraft } from "./newsroom-rewrite-adapter";

describe("newsroom analysis sanitization", () => {
  it("removes generic expert attribution from analysis without deleting supported analysis", () => {
    const normalized = normalizeNewsroomDraft({
      brief: { hasClearNewsEvent: true },
      title: "Texas agency issues statewide rule update",
      dek: "The revised rule takes effect statewide next month.",
      summary: "Texas regulators issued a revised statewide rule that takes effect next month and changes compliance requirements for licensed providers.",
      relevance: "The change affects licensed providers across Texas.",
      analysis: "Experts say the rule will transform the industry. The effective date gives providers two weeks to prepare.",
      sections: [{ heading: "What changed", paragraphs: ["The agency published the revised rule."] }],
      keyTakeaways: ["The rule takes effect next month."],
      faq: [{ q: "When does it take effect?", a: "Next month." }],
    }) as { analysis?: string };

    expect(normalized.analysis).toBe("The effective date gives providers two weeks to prepare.");
    expect(normalized.analysis).not.toMatch(/experts say/i);
  });
});
