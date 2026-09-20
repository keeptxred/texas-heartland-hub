import fs from "node:fs";
import { describe, expect, it } from "vitest";

const server = fs.readFileSync(new URL("./newsroom-admin.functions.ts", import.meta.url), "utf8");
const route = fs.readFileSync(new URL("../routes/admin/newsroom.tsx", import.meta.url), "utf8");
const migration = fs.readFileSync(
  new URL("../../supabase/migrations/20260816104500_add_newsroom_admin_control_center.sql", import.meta.url),
  "utf8",
);

describe("newsroom Phase 11 admin control center", () => {
  it("keeps editorial controls zero-AI and non-publishing", () => {
    expect(server).toContain('z.enum(["SELECT", "HOLD", "REJECT", "RELEASE"])');
    expect(server).toContain('process.env.ADMIN_PASSCODE');
    expect(server).toContain('.from("news_publish_candidates").update');
    expect(server).toContain('.from("news_story_clusters").update');
    expect(server).toContain('.from("newsroom_editorial_actions").insert');
    expect(server).not.toContain("runCloudflareJson");
    expect(server).not.toContain("newsroom_reserve_ai_generation");
    expect(server).not.toContain('.from("daily_articles").insert');
    expect(server).not.toContain('.from("daily_articles").upsert');
  });

  it("surfaces budgets, evidence, drafts, briefs and cron health", () => {
    for (const marker of [
      'ai_generation_budget',
      'news_publish_candidates',
      'news_story_clusters',
      'news_research_packets',
      'newsroom_generation_drafts',
      'newsroom_daily_briefs',
      'newsroom_admin_cron_health',
    ]) expect(server).toContain(marker);
    expect(route).toContain("Editorial Control Center");
    expect(route).toContain("Review evidence");
    expect(route).toContain("Generation Draft Ledger");
    expect(route).toContain("Texas Daily Brief Ledger");
    expect(route).toContain("Pipeline Cron Health");
  });

  it("keeps the admin support schema server-only and schedule-neutral", () => {
    expect(migration).toContain("ALTER TABLE public.newsroom_editorial_actions ENABLE ROW LEVEL SECURITY");
    expect(migration).toContain("REVOKE ALL ON FUNCTION public.newsroom_admin_cron_health() FROM PUBLIC, anon, authenticated");
    expect(migration).toContain("GRANT EXECUTE ON FUNCTION public.newsroom_admin_cron_health() TO service_role");
    expect(migration).not.toContain("cron.schedule");
    expect(migration).not.toContain("newsroom_reserve_ai_generation");
  });
});
