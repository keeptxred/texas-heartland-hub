import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  "supabase/migrations/20261102204800_index_texas_news_feed_source_created_at.sql",
  "utf8",
);
const hook = readFileSync(
  "src/routes/api/public/hooks/build-newsroom-research-packets.ts",
  "utf8",
);

describe("TDEM direct release cache-hygiene query timeout", () => {
  it("adds the parameter-safe source equality plus newest-first created-at index", () => {
    expect(migration).toMatch(
      /create index if not exists texas_news_feed_source_created_at_idx\s+on public\.texas_news_feed\s*\(source, created_at desc\)/i,
    );
    expect(migration).not.toMatch(/drop\s+(?:table|index)|alter\s+table|disable\s+row\s+level/i);
  });

  it("keeps the original narrow, dated, one-item maintenance and no rejected candidate reactivation", () => {
    expect(hook).toContain('.eq("source", "Texas Division of Emergency Management — Direct Releases")');
    expect(hook).toContain('.gte("created_at", tdemScanSince)');
    expect(hook).toContain('.order("created_at", { ascending: false })');
    expect(hook).toContain('.limit(TDEM_CACHE_CLEANUP_SCAN_LIMIT)');
    expect(hook).toContain("const TDEM_CACHE_CLEANUP_SCAN_LIMIT = 8");
    expect(hook).toContain("const TDEM_CACHE_CLEANUP_FETCH_LIMIT = 1");
  });
});
