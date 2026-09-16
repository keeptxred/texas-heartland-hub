import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const sourcePath = fileURLToPath(new URL("./normalize-newsroom-feed.ts", import.meta.url));
const source = readFileSync(sourcePath, "utf8");

describe("newsroom normalization current-row lookup", () => {
  it("keeps historical dedupe context separate from exact current feed lookups", () => {
    expect(source).toContain("const priorRows = (priorData ?? []) as PriorNormalizationRow[]");
    expect(source).toContain("const minFeedItemId = Math.min(...feedRows.map((row) => row.id))");
    expect(source).toContain("const maxFeedItemId = Math.max(...feedRows.map((row) => row.id))");
    expect(source).toContain('.gte("feed_item_id", minFeedItemId)');
    expect(source).toContain('.lte("feed_item_id", maxFeedItemId)');
    expect(source).toContain("new Map(currentPriorRows.map((row) => [row.feed_item_id, row]))");
    expect(source).not.toContain("new Map(priorRows.map((row) => [row.feed_item_id, row]))");
  });

  it("uses one bounded current-row lookup instead of chunked IN requests", () => {
    expect(source).not.toContain("CURRENT_LOOKUP_CHUNK_SIZE");
    expect(source).not.toContain('.in("feed_item_id", chunk)');
    expect(source).toContain(".limit(FEED_LIMIT)");
  });
});
