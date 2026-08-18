import fs from "node:fs";
import { describe, expect, it } from "vitest";

const dailySource = fs.readFileSync(new URL("./daily-news.functions.ts", import.meta.url), "utf8");
const categorySource = fs.readFileSync(new URL("./category-feed.functions.ts", import.meta.url), "utf8");
const sportsSource = fs.readFileSync(new URL("./sports.functions.ts", import.meta.url), "utf8");

describe("public cloud article quarantine", () => {
  it("removes quarantined rows before homepage, newsroom, breaking, and author discovery", () => {
    expect(dailySource).toContain('import { hasSeoDuplicateFlag } from "@/lib/article-canonical"');
    expect(dailySource).toContain("body_json,quality_flags");
    expect(dailySource).toContain("!hasSeoDuplicateFlag(article.quality_flags)");
    expect(dailySource).toContain("quality_flags: _qualityFlags");
  });

  it("removes quarantined rows from shared category and region feeds", () => {
    expect(categorySource).toContain('import { hasSeoDuplicateFlag } from "@/lib/article-canonical"');
    expect(categorySource).toContain("body_json,quality_flags");
    expect(categorySource).toContain("!hasSeoDuplicateFlag(row.quality_flags)");
    expect(categorySource).toContain("quality_flags: _qualityFlags");
  });

  it("removes quarantined rows from the direct sports team query", () => {
    expect(sportsSource).toContain('import { hasSeoDuplicateFlag } from "@/lib/article-canonical"');
    expect(sportsSource).toContain("body_json,quality_flags");
    expect(sportsSource).toContain("!hasSeoDuplicateFlag(row.quality_flags)");
    expect(sportsSource).toContain("quality_flags: _qualityFlags");
  });
});
