import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  "supabase/migrations/20260815200000_add_newsroom_generation_drafts.sql",
  "utf8",
);

describe("newsroom generation draft ledger", () => {
  it("stores shadow and publish outcomes without scheduling AI", () => {
    expect(migration).toContain("CREATE TABLE IF NOT EXISTS public.newsroom_generation_drafts");
    expect(migration).toContain("mode IN ('shadow','publish')");
    expect(migration).toContain("status IN ('GENERATED','REJECTED','PUBLISHED')");
    expect(migration).not.toContain("cron.schedule");
  });

  it("keeps generation drafts server-only behind RLS", () => {
    expect(migration).toContain("ALTER TABLE public.newsroom_generation_drafts ENABLE ROW LEVEL SECURITY");
    expect(migration).not.toMatch(/CREATE POLICY/i);
  });
});
