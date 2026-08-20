import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./ingest-feeds-legacy.ts", import.meta.url), "utf8");

describe("legacy ingest evidence-driven rewrite length", () => {
  it("uses compact, standard, and rich evidence floors", () => {
    expect(source).toContain("const MIN_WORDS_COMPACT = 650;");
    expect(source).toContain("const MIN_WORDS_STANDARD = 800;");
    expect(source).toContain("const MIN_WORDS_ANALYSIS = 1200;");
    expect(source).toContain("if (evidenceChars < COMPACT_SOURCE_MAX_CHARS) return MIN_WORDS_COMPACT;");
    expect(source).toContain("if (analysisCategory && evidenceChars >= RICH_SOURCE_MIN_CHARS) return MIN_WORDS_ANALYSIS;");
  });

  it("does not make a third paid expansion call after shared editorial repair", () => {
    expect(source).toContain("The shared editorial engine already performs one targeted repair");
    expect(source).toContain("return prior;");
    expect(source).not.toContain('fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {\n      method: "POST",\n      headers: { "Content-Type": "application/json", "Lovable-API-Key": lovableApiKey },\n      body: JSON.stringify({\n        model: "google/gemini-3-flash-preview",\n        messages: [\n          { role: "system", content: REWRITE_SYSTEM },');
  });

  it("keeps the downstream evidence-driven publication floor", () => {
    expect(source).toContain("const target = minWordsForItem(item, rw);");
    expect(source).toContain("Rewrite below tiered minimum (${words}/${target} words). Try again.");
  });
});
