import { describe, expect, it, vi } from "vitest";
import { runEditorialRewrite } from "./editorial-pipeline";

function words(prefix: string, count: number): string {
  return Array.from({ length: count }, (_, index) => `${prefix}${index}`).join(" ");
}

function draft(mainWords: number, title = "Texas businesses prepare for verified policy change") {
  const summaryWords = 50;
  const bodyWords = Math.max(1, mainWords - summaryWords);
  return {
    brief: {
      hasClearNewsEvent: true,
      category: "business",
      primarySubject: "Texas businesses",
      primaryEvent: "Texas businesses prepared for a verified policy change",
      facts: { actions: ["prepared for a verified policy change"] },
    },
    title,
    dek: "Texas businesses are preparing for a verified policy change described in the source material.",
    summary: words("summary", summaryWords),
    relevance: "The verified change affects Texas businesses and their next operational steps.",
    category: "business",
    sections: Array.from({ length: Math.ceil(bodyWords / 80) }, (_, index) => ({
      heading: `Verified development ${index + 1}`,
      paragraphs: [words(`detail${index}-`, Math.min(80, bodyWords - index * 80))],
    })),
  };
}

describe("editorial short-draft completion", () => {
  it("uses one final completion pass when the strict retry remains below the tier", async () => {
    const calls: Array<{ addendum: string; attempt: string }> = [];
    const generate = vi.fn(
      async (
        addendum: string,
        attempt: "initial" | "strict-retry" | "length-completion",
      ) => {
        calls.push({ addendum, attempt });
        const payload = attempt === "initial" ? draft(300) : attempt === "strict-retry" ? draft(420) : draft(1250);
        return { raw: JSON.stringify(payload) };
      },
    );

    const result = await runEditorialRewrite(generate);

    expect(result.validation.ok).toBe(true);
    expect(result.attempts).toBe(3);
    expect(calls.map((call) => call.attempt)).toEqual([
      "initial",
      "strict-retry",
      "length-completion",
    ]);
    expect(calls[2].addendum).toContain("LENGTH COMPLETION — FINAL REPAIR PASS");
    expect(calls[2].addendum).toMatch(/tiered_main_word_count:\d+\/1200/);
    expect(calls[2].addendum).toContain("PREVIOUS DRAFT JSON");
  });

  it("still rejects a completed-length draft that fails another editorial rule", async () => {
    const generate = vi.fn(
      async (
        _addendum: string,
        attempt: "initial" | "strict-retry" | "length-completion",
      ) => ({
        raw: JSON.stringify(
          attempt === "length-completion" ? draft(1250, "Short") : draft(attempt === "initial" ? 300 : 420),
        ),
      }),
    );

    const result = await runEditorialRewrite(generate);

    expect(result.article).toBeNull();
    expect(result.attempts).toBe(3);
    expect(result.validation.ok).toBe(false);
    expect(result.validation.reasons).toContain("missing_or_short_title");
  });
});
