import { describe, expect, it } from "vitest";
import fs from "node:fs";

const migration = fs.readFileSync(
  "supabase/migrations/20260829165000_guard_newsroom_source_family_diversity.sql",
  "utf8",
);

describe("generated newsroom source-family publication guard", () => {
  it("collapses feed/canonical subdomains and blocks fake multi-source packets", () => {
    expect(migration).toContain("newsroom_source_family_from_url");
    expect(migration).toContain("count(distinct public.newsroom_source_family_from_url");
    expect(migration).toContain("primary_count = 0 and family_count < 2");
    expect(migration).toContain("newsroom_source_family_diversity_hold");
    expect(migration).toContain("before insert on public.daily_articles");
  });

  it("keeps a primary-source escape hatch without weakening source diversity", () => {
    expect(migration).toContain("primarySourceCount");
    expect(migration).toContain("Add an independent publisher family or a substantive primary/official record before publication");
  });
});
