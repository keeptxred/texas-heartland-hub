import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const source = readFileSync(resolve(process.cwd(), "src/routes/api/public/hooks/reconcile-news-history.ts"), "utf8");
const migration = readFileSync(resolve(process.cwd(), "supabase/migrations/20260817073000_add_news_event_reconciliation_holds.sql"), "utf8");

describe("reconcile news history hook", () => {
  it("keeps GET read-only and POST authenticated", () => {
    expect(source).toContain("GET: ({ request }) => reconcile(request, false)");
    expect(source).toContain("POST: ({ request }) => reconcile(request, true)");
    expect(source).toContain("if (apply && !isAuthorizedApply(request))");
    expect(source).toContain("NEWSROOM_HOOK_TOKEN");
    expect(source).toContain("ADMIN_PASSCODE");
  });

  it("does not write daily_articles or alter article slugs or publication timestamps", () => {
    expect(source).not.toMatch(/from\(["']daily_articles["']\)\.update/);
    expect(source).not.toMatch(/from\(["']daily_articles["']\)\.upsert/);
    expect(source).not.toMatch(/from\(["']daily_articles["']\)\.delete/);
    expect(source).toContain('select("slug,published_at")');
    expect(source).toContain("articleWrites: 0");
    expect(source).toContain("slugChanges: 0");
  });

  it("uses deterministic event persistence and structured fact provenance with no AI", () => {
    expect(source).toContain("persistEventCluster");
    expect(source).toContain("buildStructuredFactLedger");
    expect(source).toContain("persistStructuredFacts");
    expect(source).toContain("aiCalls: 0");
    expect(source).not.toContain("runCloudflareJson");
    expect(source).not.toContain("LOVABLE_API_KEY");
  });

  it("queues ambiguous history for review without assigning cluster ownership", () => {
    expect(source).toContain('if (plan.kind === "hold")');
    expect(source).toContain('groupKey: `multiple-slugs:${plan.feedItemIds[0]}`');
    const holdBranch = source.slice(source.indexOf('if (plan.kind === "hold")'), source.indexOf("const missingSlugs"));
    expect(holdBranch).toContain("recordHold");
    expect(holdBranch).not.toContain("persistEventCluster");
    expect(source).toContain("held_for_admin_review");
    expect(migration).toContain("news_event_reconciliation_holds");
    expect(migration).toContain("review_status");
  });

  it("restores historical cluster timestamps instead of making backfill look newly published", () => {
    expect(source).toContain("historicalBounds(plan)");
    expect(source).toContain("historicalTimestamps.published_at = article.published_at");
    expect(source).toContain("historicalTimestamps.synthesized_at = article.published_at");
  });
});
