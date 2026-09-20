import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  "supabase/migrations/20260815192500_add_newsroom_ai_budget_guardrails.sql",
  "utf8",
);

describe("newsroom hard AI budget guardrails", () => {
  it("adds atomic reservation and finalize functions", () => {
    expect(migration).toContain("newsroom_reserve_ai_generation");
    expect(migration).toContain("newsroom_finalize_ai_generation");
    expect(migration).toContain("FOR UPDATE");
  });

  it("enforces normal, breaking and briefing capacities including reservations", () => {
    expect(migration).toContain("budget.normal_used + budget.normal_reserved >= budget.normal_limit");
    expect(migration).toContain("budget.breaking_used + budget.breaking_reserved >= budget.breaking_limit");
    expect(migration).toContain("budget.briefing_used + budget.briefing_reserved >= budget.briefing_limit");
    expect(migration).toContain("briefing_used + briefing_reserved <= briefing_limit");
  });

  it("releases failed reservations without charging usage", () => {
    expect(migration).toContain("CASE WHEN p_success THEN 1 ELSE 0 END");
    expect(migration).toContain("normal_reserved = normal_reserved - 1");
    expect(migration).toContain("breaking_reserved = breaking_reserved - 1");
    expect(migration).toContain("briefing_reserved = briefing_reserved - 1");
  });

  it("does not expose budget mutation RPCs to public clients", () => {
    expect(migration).toContain("FROM PUBLIC, anon, authenticated");
    expect(migration).toContain("TO service_role");
  });
});
