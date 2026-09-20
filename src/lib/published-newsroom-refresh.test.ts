import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const packetBuilder = readFileSync("src/routes/api/public/hooks/build-newsroom-research-packets.ts", "utf8");
const refresher = readFileSync("src/routes/api/public/hooks/refresh-published-newsroom.ts", "utf8");
const workflow = readFileSync(".github/workflows/refresh-published-news.yml", "utf8");

describe("published newsroom freshness refresh", () => {
  it("keeps rebuilding source packets after a candidate is published", () => {
    expect(packetBuilder).toContain('"PUBLISHED"');
    expect(packetBuilder).toContain('"PENDING", "HELD", "SELECTED", "PUBLISHED"');
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
    expect(refresher).not.toContain("published_at:");
  });

  it("keeps the refresh source-backed, neutral, and budget bounded", () => {
    expect(refresher).toContain("assessStoryNovelty");
    expect(refresher).toContain("Do not advocate for or against any candidate");
    expect(refresher).toContain('p_kind: AI_KIND');
    expect(refresher).toContain("ai_budget_exhausted");
    expect(refresher).toContain("MAX_NEW_SOURCES_IN_PROMPT = 4");
  });

  it("checks for new evidence every two hours without increasing ordinary publishing cadence", () => {
    expect(workflow).toContain('cron: "47 */2 * * *"');
    expect(workflow).toContain("build-newsroom-research-packets");
    expect(workflow).toContain("refresh-published-newsroom");
    expect(workflow).not.toContain("generate-newsroom?mode=publish");
  });
});
