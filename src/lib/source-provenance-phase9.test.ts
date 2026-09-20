import fs from "node:fs";
import { describe, expect, it } from "vitest";

const migrationPath = "supabase/migrations/20260816165000_add_source_provenance_admin_controls.sql";
const migration = fs.readFileSync(migrationPath, "utf8");
const server = fs.readFileSync("src/lib/article-source-transparency-admin.functions.ts", "utf8");
const route = fs.readFileSync("src/routes/admin.source-provenance.tsx", "utf8");

describe("Phase 9 source provenance controls", () => {
  it("routes mutations through one transactional database RPC", () => {
    expect(migration).toContain("CREATE OR REPLACE FUNCTION public.admin_mutate_news_event_cluster");
    expect(server).toContain('.rpc("admin_mutate_news_event_cluster"');
    expect(server).not.toContain('.from("news_event_cluster_sources").update(');
  });

  it("keeps mutation RPCs service-role only", () => {
    expect(migration).toMatch(/REVOKE ALL ON FUNCTION public\.admin_mutate_news_event_cluster[\s\S]*FROM PUBLIC, anon, authenticated;/);
    expect(migration).toMatch(/GRANT EXECUTE ON FUNCTION public\.admin_mutate_news_event_cluster[\s\S]*TO service_role;/);
  });

  it("blocks unsafe merges between different published articles", () => {
    expect(migration).toContain("Cannot merge clusters attached to different published articles");
    expect(migration).toContain("Cannot merge clusters attached to different published slugs");
    expect(migration).toContain("Published cluster must be the merge target, not the source");
  });

  it("prevents splitting the only source from a cluster", () => {
    expect(migration).toContain("Cannot split the only source out of a cluster");
  });

  it("rejects null relationship overrides inside the database RPC", () => {
    expect(migration).toContain("p_relationship_type IS NULL OR p_relationship_type NOT IN");
  });

  it("recalculates source counts and resynchronizes the existing article instead of inserting a new one", () => {
    expect(migration).toContain("refresh_news_event_cluster_counts");
    expect(migration).toContain("sync_news_event_cluster_article_sources");
    expect(migration).toMatch(/UPDATE ONLY public\.daily_articles[\s\S]*body_json = jsonb_set/);
    expect(migration).not.toMatch(/INSERT INTO public\.daily_articles/);
  });

  it("records an immutable audit entry for every accepted mutation", () => {
    expect(migration).toContain("CREATE TABLE IF NOT EXISTS public.news_event_cluster_admin_actions");
    expect(migration).toContain("INSERT INTO public.news_event_cluster_admin_actions");
    expect(server).toContain("news_event_cluster_admin_actions");
  });

  it("supports relationship, lineage, split, merge and explicit article-source sync controls", () => {
    for (const action of ["SET_RELATIONSHIP", "SET_LINEAGE", "SPLIT_SOURCE", "MERGE_CLUSTER", "SYNC_ARTICLE_SOURCES"]) {
      expect(server).toContain(action);
      expect(migration).toContain(action);
    }
    expect(route).toContain("Save role");
    expect(route).toContain("Save lineage");
    expect(route).toContain("Split into new cluster");
    expect(route).toContain("Merge & archive source");
    expect(route).toContain("Sync article sources");
  });

  it("requires browser confirmation for destructive merge and split actions", () => {
    expect(route).toContain("window.confirm(prompt)");
    expect(route).toContain("window.confirm(`Split");
  });
});
