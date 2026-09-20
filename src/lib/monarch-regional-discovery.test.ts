import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  new URL("../../supabase/migrations/20260820155000_restore_monarch_regional_discovery.sql", import.meta.url),
  "utf8",
);
const categoryFeed = readFileSync(new URL("./category-feed.functions.ts", import.meta.url), "utf8");

describe("restored Monarch article discovery", () => {
  it("normalizes the restored row to the San Antonio region slug used by browse queries", () => {
    expect(migration).toContain("affected_regions = array['san-antonio']::text[]");
    expect(migration).toContain("legacy_url_restored");
    expect(categoryFeed).toContain('.contains("affected_regions", [data.region])');
  });
});
