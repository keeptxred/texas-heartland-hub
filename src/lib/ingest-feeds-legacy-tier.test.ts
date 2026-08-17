import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./ingest-feeds-legacy.ts", import.meta.url), "utf8");

describe("legacy ingest tiered rewrite expansion", () => {
  it("calculates expansion need from the item tier instead of the 800-word baseline", () => {
    expect(source).toContain("const target = minWordsForItem(it, prior);");
    expect(source).toContain("const need = target - currentWords;");
    expect(source).not.toContain("const need = NON_EVERGREEN_MIN_MAIN_WORDS - currentWords;");
  });

  it("keeps the downstream tiered publication floor", () => {
    expect(source).toContain("const target = minWordsForItem(item, rw);");
    expect(source).toContain("Rewrite below tiered minimum (${words}/${target} words). Try again.");
  });
});
