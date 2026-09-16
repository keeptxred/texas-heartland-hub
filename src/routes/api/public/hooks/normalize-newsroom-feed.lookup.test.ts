import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const sourcePath = fileURLToPath(new URL("./normalize-newsroom-feed.ts", import.meta.url));
const source = readFileSync(sourcePath, "utf8");

describe("newsroom normalization current-row lookup", () => {
  it("keeps historical dedupe context separate from exact current feed lookups", () => {
    expect(source).toContain("const priorRows = (priorData ?? []) as PriorNormalizationRow[]");
    expect(source).toContain("const feedItemIds = feedRows.map((row) => row.id)");
    expect(source).toContain('.in("feed_item_id", chunk)');
    expect(source).toContain("const currentPriorRows = currentPriorResults.flatMap");
    expect(source).toContain("new Map(currentPriorRows.map((row) => [row.feed_item_id, row]))");
    expect(source).not.toContain("new Map(priorRows.map((row) => [row.feed_item_id, row]))");
  });

  it("chunks the exact lookup so a 1,000-row feed does not create one oversized PostgREST URL", () => {
    expect(source).toContain("const CURRENT_LOOKUP_CHUNK_SIZE = 250");
    expect(source).toContain("index += CURRENT_LOOKUP_CHUNK_SIZE");
    expect(source).toContain("feedItemIds.slice(index, index + CURRENT_LOOKUP_CHUNK_SIZE)");
  });
});
