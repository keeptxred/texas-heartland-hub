import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  "supabase/migrations/20260815185000_add_newsroom_story_cluster_schema.sql",
  "utf8",
);

describe("newsroom story-cluster schema", () => {
  it("creates the four Phase 2 newsroom tables", () => {
    expect(migration).toContain("CREATE TABLE IF NOT EXISTS public.news_story_clusters");
    expect(migration).toContain("CREATE TABLE IF NOT EXISTS public.news_story_cluster_items");
    expect(migration).toContain("CREATE TABLE IF NOT EXISTS public.news_publish_candidates");
    expect(migration).toContain("CREATE TABLE IF NOT EXISTS public.ai_generation_budget");
  });

  it("supports skip, single, merge and synthesis decisions without changing live publishing", () => {
    expect(migration).toContain("'SKIP','SINGLE','MERGE','SYNTHESIS'");
    expect(migration).toContain("REFERENCES public.texas_news_feed(id)");
    expect(migration).toContain("REFERENCES public.daily_articles(id)");
    expect(migration).toContain("does not itself trigger generation");
  });

  it("preserves source provenance and allows a feed item to participate in more than one editorial package", () => {
    expect(migration).toContain("UNIQUE (cluster_id, feed_item_id)");
    expect(migration).not.toContain("UNIQUE (feed_item_id)");
    expect(migration).toContain("is_primary_source boolean");
    expect(migration).toContain("relationship_type");
  });

  it("creates safe daily generation-budget counters for the later hard-guard phase", () => {
    expect(migration).toContain("normal_limit integer NOT NULL DEFAULT 8");
    expect(migration).toContain("breaking_limit integer NOT NULL DEFAULT 2");
    expect(migration).toContain("briefing_limit integer NOT NULL DEFAULT 1");
    expect(migration).toContain("normal_used + normal_reserved <= normal_limit");
    expect(migration).toContain("breaking_used + breaking_reserved <= breaking_limit");
  });

  it("adds score/status indexes and updated-at triggers for operational use", () => {
    expect(migration).toContain("idx_news_story_clusters_status_score");
    expect(migration).toContain("idx_news_publish_candidates_status_score");
    expect(migration).toContain("newsroom_set_updated_at");
  });
});
