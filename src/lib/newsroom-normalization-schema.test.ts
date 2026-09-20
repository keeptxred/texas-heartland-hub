import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  "supabase/migrations/20260815190500_add_newsroom_zero_ai_normalization.sql",
  "utf8",
);

describe("newsroom Phase 3 normalization schema", () => {
  it("keeps normalization in a sidecar instead of mutating raw feed rows", () => {
    expect(migration).toContain("CREATE TABLE IF NOT EXISTS public.news_feed_normalization");
    expect(migration).toContain("REFERENCES public.texas_news_feed(id) ON DELETE CASCADE");
    expect(migration).toContain("Raw texas_news_feed rows remain untouched");
  });

  it("limits deterministic duplicate reasons to exact URL or same-source title repeats", () => {
    expect(migration).toContain("'canonical-url','same-source-title'");
    expect(migration).toContain("Cross-outlet same-event reports intentionally remain independent");
  });

  it("records normalization version and duplicate confidence", () => {
    expect(migration).toContain("normalization_version integer NOT NULL DEFAULT 1");
    expect(migration).toContain("dedupe_confidence real");
  });

  it("adds an active zero-AI normalization schedule without touching existing schedules", () => {
    expect(migration).toContain("keep-tx-red-normalize-newsroom-feed");
    expect(migration).toContain("7,22,37,52 * * * *");
    expect(migration).not.toContain("cron.unschedule");
    expect(migration).not.toContain("active := false");
  });
});
