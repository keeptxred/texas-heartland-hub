import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  "supabase/migrations/20260815203000_add_newsroom_daily_briefs.sql",
  "utf8",
);

describe("Texas Daily Brief schema", () => {
  it("stores one bounded grouped brief without scheduling AI", () => {
    expect(migration).toContain("CREATE TABLE IF NOT EXISTS public.newsroom_daily_briefs");
    expect(migration).toContain("cardinality(cluster_ids) <= 10");
    expect(migration).toContain("brief_date, mode");
    expect(migration).not.toContain("cron.schedule");
  });

  it("keeps the briefing ledger server-only", () => {
    expect(migration).toContain("ALTER TABLE public.newsroom_daily_briefs ENABLE ROW LEVEL SECURITY");
    expect(migration).not.toMatch(/CREATE POLICY/i);
  });
});
