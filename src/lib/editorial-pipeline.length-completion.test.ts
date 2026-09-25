import { describe, expect, it, vi } from "vitest";
import { editorialMinimumFor, runEditorialRewrite } from "./editorial-pipeline";

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

describe("editorial retry ceiling", () => {
  it("stops after one targeted repair instead of spending a third AI call on length", async () => {
    const calls: Array<{ addendum: string; attempt: string }> = [];
    const generate = vi.fn(
      async (
        addendum: string,
        attempt: "initial" | "strict-retry" | "length-completion",
      ) => {
        calls.push({ addendum, attempt });
        return { raw: JSON.stringify(draft(attempt === "initial" ? 300 : 420)) };
      },
    );

    const result = await runEditorialRewrite(generate);

    expect(result.article).toBeNull();
    expect(result.validation.ok).toBe(false);
    expect(result.attempts).toBe(2);
    expect(calls.map((call) => call.attempt)).toEqual(["initial", "strict-retry"]);
    expect(calls[1].addendum).toMatch(/tiered_main_word_count:\d+\/1200/);
    expect(calls[1].addendum).toContain("PREVIOUS DRAFT JSON");
  });

  it("measures an official primary-record wrapper by the raw secondary evidence", () => {
    const raw = "x".repeat(4275);
    const wrapped = [
      "PRIMARY-RECORD-AUGMENTED SOURCE PACKET.",
      "PRIMARY RECORD: Texas Secretary of State verified dates.",
      "RAW SECONDARY SOURCE:",
      raw,
    ].join("\n\n");

    expect(editorialMinimumFor("politics", raw)).toBe(650);
    expect(editorialMinimumFor("politics", wrapped)).toBe(650);
  });

  it("allows one final length-only completion for a primary-record-augmented draft", async () => {
    const sourceText = [
      "PRIMARY-RECORD-AUGMENTED SOURCE PACKET.",
      "PRIMARY RECORD: Texas Secretary of State verified dates.",
      "RAW SECONDARY SOURCE:",
      "x".repeat(4275),
    ].join("\n\n");
    const calls: Array<{ addendum: string; attempt: string }> = [];
    const generate = vi.fn(
      async (
        addendum: string,
        attempt: "initial" | "strict-retry" | "length-completion",
      ) => {
        calls.push({ addendum, attempt });
        const mainWords = attempt === "initial" ? 300 : attempt === "strict-retry" ? 448 : 680;
        return { raw: JSON.stringify(draft(mainWords, "Texas voter registration deadline set for November election")) };
      },
    );

    const result = await runEditorialRewrite(generate, sourceText);

    expect(result.validation.ok).toBe(true);
    expect(result.attempts).toBe(3);
    expect(calls.map((call) => call.attempt)).toEqual(["initial", "strict-retry", "length-completion"]);
    expect(calls[1].addendum).toMatch(/tiered_main_word_count:\d+\/650/);
    expect(calls[2].addendum).toContain("LENGTH COMPLETION");
    expect(calls[2].addendum).toMatch(/tiered_main_word_count:\d+\/650/);
  });

  it("still rejects a repaired draft that fails another editorial rule", async () => {
    const generate = vi.fn(
      async (
        _addendum: string,
        attempt: "initial" | "strict-retry" | "length-completion",
      ) => ({
        raw: JSON.stringify(draft(attempt === "initial" ? 300 : 1250, attempt === "initial" ? undefined : "Short")),
      }),
    );

    const result = await runEditorialRewrite(generate);

    expect(result.article).toBeNull();
    expect(result.attempts).toBe(2);
    expect(result.validation.ok).toBe(false);
    expect(result.validation.reasons).toContain("missing_or_short_title");
  });
});
