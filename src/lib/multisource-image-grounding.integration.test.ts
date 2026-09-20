import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const source = fs.readFileSync(path.resolve("src/lib/featured-image.functions.ts"), "utf8");

describe("Phase 11 image pipeline integration", () => {
  it("loads published durable clusters and their fact ledger before generation", () => {
    expect(source).toContain('from("news_event_clusters")');
    expect(source).toContain('from("news_event_facts")');
    expect(source).toContain('from("news_event_cluster_sources")');
    expect(source).toContain('from("texas_news_feed")');
    expect(source).toContain("loadMultiSourceImageGrounding");
  });

  it("holds unsafe multi-source images before calling the existing generator", () => {
    const holdIndex = source.indexOf('grounding?.mode === "hold_image"');
    const generationIndex = source.indexOf("generateImageBytes(prompt, negativePrompt");
    expect(holdIndex).toBeGreaterThan(-1);
    expect(generationIndex).toBeGreaterThan(holdIndex);
  });

  it("continues using the existing Cloudflare generation and validation calls without adding another AI review path", () => {
    expect(source.match(/generateImageBytes\(/g)?.length).toBe(2);
    expect(source.match(/validateImageMatchesArticle\(/g)?.length).toBe(2);
    expect(source).not.toMatch(/openai|gemini|anthropic/i);
  });

  it("applies the same generateAndStore path to automatic generation, regeneration, and backfill", () => {
    expect(source).toContain("return generateAndStore(row as ArticleRow, { overwrite: !!data.overwrite });");
    expect(source).toContain("return generateAndStore(row as ArticleRow, { overwrite: true });");
    expect(source).toContain("const r = await generateAndStore(row, { overwrite });");
  });
});
