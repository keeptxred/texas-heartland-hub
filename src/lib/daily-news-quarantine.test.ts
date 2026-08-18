import fs from "node:fs";
import { describe, expect, it } from "vitest";

const source = fs.readFileSync(new URL("./daily-news.functions.ts", import.meta.url), "utf8");

describe("public daily-news quarantine", () => {
  it("loads quality flags and removes quarantined rows before public discovery", () => {
    expect(source).toContain('import { hasSeoDuplicateFlag } from "@/lib/article-canonical"');
    expect(source).toContain("body_json,quality_flags");
    expect(source).toContain("!hasSeoDuplicateFlag(article.quality_flags)");
  });

  it("does not expose quarantine metadata in the public article shape", () => {
    expect(source).toContain("quality_flags: _qualityFlags");
    expect(source).toContain("...article");
  });
});
