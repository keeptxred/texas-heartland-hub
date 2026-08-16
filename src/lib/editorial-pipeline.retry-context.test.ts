import { describe, expect, it, vi } from "vitest";
import { runEditorialRewrite } from "./editorial-pipeline";

function words(prefix: string, count: number): string {
  return Array.from({ length: count }, (_, index) => `${prefix}${index}`).join(" ");
}

function validArticle() {
  return {
    brief: {
      hasClearNewsEvent: true,
      category: "politics",
      primarySubject: "Texas lawmakers",
      primaryEvent: "Texas lawmakers advanced a bill",
      facts: { actions: ["advanced a bill"] },
    },
    title: "Texas lawmakers advance a bill after committee vote",
    summary: words("summary", 50),
    relevance: "The measure now moves to the next stage of the legislative process.",
    category: "politics",
    sections: Array.from({ length: 10 }, (_, sectionIndex) => ({
      heading: `What happened in stage ${sectionIndex + 1}`,
      paragraphs: [words(`detail${sectionIndex}-`, 82)],
    })),
  };
}

describe("failure-aware editorial retry", () => {
  it("passes the exact validation failures and prior draft into the strict retry", async () => {
    const firstDraft = {
      brief: {
        hasClearNewsEvent: true,
        category: "sports",
        primarySubject: "Texas A&M",
        primaryEvent: "Texas A&M prepared for an NFL preseason week",
      },
      title: "A&M",
      summary: words("short", 40),
      category: "sports",
      sections: [{ heading: "Preseason", paragraphs: [words("detail", 120)] }],
    };

    const calls: Array<{ addendum: string; attempt: string }> = [];
    const generate = vi.fn(async (addendum: string, attempt: "initial" | "strict-retry") => {
      calls.push({ addendum, attempt });
      return {
        raw: JSON.stringify(attempt === "initial" ? firstDraft : validArticle()),
      };
    });

    const result = await runEditorialRewrite(generate);

    expect(result.validation.ok).toBe(true);
    expect(result.attempts).toBe(2);
    expect(calls).toHaveLength(2);
    expect(calls[1].attempt).toBe("strict-retry");
    expect(calls[1].addendum).toContain("missing_or_short_title");
    expect(calls[1].addendum).toMatch(/tiered_main_word_count:\d+\/1200/);
    expect(calls[1].addendum).toContain('"title":"A&M"');
    expect(calls[1].addendum).toMatch(/Repair the supplied draft instead\s+of restarting from scratch/);
  });
});
