import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync("src/routes/api/public/hooks/generate-newsroom.ts", "utf8");

describe("newsroom metadata uses the validated source-backed draft", () => {
  it("publishes validated dek text and the article's factual Texas relevance", () => {
    expect(source).toContain("dek: draft.dek.slice(0, 400)");
    expect(source).toContain("enrichArticleRow(row);");
    expect(source).toContain("texas_impact_summary =");
    expect(source).toContain("draft.relevance.trim().slice(0, 750)");
    expect(source.indexOf("enrichArticleRow(row);")).toBeLessThan(
      source.indexOf("draft.relevance.trim().slice(0, 750)"),
    );
    expect(source.indexOf("draft.relevance.trim().slice(0, 750)")).toBeLessThan(
      source.indexOf('.upsert(readyRow, { onConflict: "slug" })'),
    );
  });
});
