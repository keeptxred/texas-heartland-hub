import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const sourcePath = fileURLToPath(new URL("./generate-news.ts", import.meta.url));
const source = readFileSync(sourcePath, "utf8");

describe("retired legacy Daily Texas News writer", () => {
  it("cannot write articles or spend AI quota", () => {
    expect(source).toContain("LEGACY_GENERATE_NEWS_DISABLED = true");
    expect(source).toContain("legacy_single_source_writer_retired_use_clustered_newsroom");
    expect(source).toContain("no_items: true");
    expect(source).toContain("aiCalls: 0");
    expect(source).toContain("inserted: 0");
    expect(source).not.toMatch(/\.from\(["']daily_articles["']\)/);
    expect(source).not.toContain("ai.gateway.legacy-builder.dev");
    expect(source).not.toContain("runCloudflareJson");
  });

  it("points callers to the quality-gated clustered newsroom", () => {
    expect(source).toContain('/api/public/hooks/generate-newsroom?mode=publish');
    expect(source).toContain('"x-robots-tag": "noindex, nofollow"');
    expect(source).toContain('"cache-control": "no-store"');
  });
});
