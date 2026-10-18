import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const packetBuilder = readFileSync("src/routes/api/public/hooks/build-newsroom-research-packets.ts", "utf8");
const refresher = readFileSync("src/routes/api/public/hooks/refresh-published-newsroom.ts", "utf8");
const workflow = readFileSync(".github/workflows/refresh-published-news.yml", "utf8");
const cronCadence = readFileSync("supabase/migrations/20261007152500_restore_reduced_newsroom_cron_cadence.sql", "utf8");

describe("published newsroom freshness refresh", () => {
  it("keeps rebuilding source packets after a candidate is published", () => {
    expect(packetBuilder).toContain('.eq("status", "PUBLISHED")');
    expect(packetBuilder).toContain('.gte("published_at", new Date(Date.now() - PUBLISHED_REFRESH_HOURS');
    expect(packetBuilder).toContain("const PUBLISHED_REFRESH_HOURS = 48");
    expect(packetBuilder).toContain("const PUBLISHED_REFRESH_LIMIT = 80");
  });

  it("requires new packet evidence and a later story observation before touching the article", () => {
    expect(refresher).toContain("timestamp(packetRow.built_at) <= articleChangedAt");
    expect(refresher).toContain("timestamp(cluster.last_seen_at) <= articleChangedAt");
    expect(refresher).toContain("!previousUrls.has(source.url)");
    expect(refresher).toContain("isMaterialSource(source, novelty)");
  });

  it("updates the existing canonical article in place and records an exact update instant", () => {
    expect(refresher).toContain('.from("daily_articles")');
    expect(refresher).toContain(".update({");
    expect(refresher).toContain("updated: now.toISOString()");
    expect(refresher).toContain('.eq("id", selected.article.id)');
    expect(refresher).toContain('.eq("slug", selected.article.slug)');
    expect(refresher).not.toContain(".upsert(");
    expect(refresher).not.toMatch(/\.update\(\{[\s\S]{0,600}published_at:/);
  });

  it("keeps the refresh source-backed, neutral, and budget bounded", () => {
    expect(refresher).toContain("assessStoryNovelty");
    expect(refresher).toContain("Do not advocate for or against any candidate");
    expect(refresher).toContain('p_kind: AI_KIND');
    expect(refresher).toContain("ai_budget_exhausted");
    expect(refresher).toContain("MAX_NEW_SOURCES_IN_PROMPT = 4");
  });

  it("keeps refresh authorization tied to the exact active GitHub workflow run", () => {
    expect(workflow).toContain("actions: read");
    expect(workflow).toContain("X-GitHub-Token:");
    expect(workflow).toContain("X-GitHub-Run-Id:");
    expect(workflow).toContain("X-GitHub-Repository:");
    expect(refresher).toContain("verifyActiveGithubRun");
    expect(refresher).toContain('run?.path === WORKFLOW_PATH');
    expect(refresher).toContain('run?.head_branch === "main"');
    expect(refresher).toContain('["queued", "in_progress"].includes');
  });

  it("checks for new evidence every two hours without duplicating pg_cron normalization or clustering", () => {
    expect(workflow).toContain('cron: "47 */2 * * *"');
    expect(workflow).toContain("enrich-newsroom-rss-evidence");
    expect(workflow).toContain("build-newsroom-research-packets");
    expect(workflow).toContain("refresh-published-newsroom");
    expect(workflow).not.toContain("run_zero_ai_stage normalize normalize-newsroom-feed");
    expect(workflow).not.toContain("run_zero_ai_stage cluster cluster-newsroom-stories");
    expect(workflow).not.toContain("generate-newsroom?mode=publish");
  });

  it("records the reduced newsroom pg_cron cadence used in production", () => {
    for (const expected of [
      "keep-tx-red-normalize-newsroom-feed",
      "schedule => '7,37 * * * *'",
      "keep-tx-red-cluster-newsroom-stories",
      "schedule => '9,39 * * * *'",
      "keep-tx-red-score-newsroom-stories",
      "schedule => '11,41 * * * *'",
      "keep-tx-red-decide-newsroom-packages",
      "schedule => '13,43 * * * *'",
      "keep-tx-red-build-newsroom-research-packets",
      "schedule => '29 * * * *'",
    ]) {
      expect(cronCadence).toContain(expected);
    }
  });
});
