import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const source = readFileSync(resolve(process.cwd(), "src/routes/api/public/hooks/reconcile-news-history.ts"), "utf8");

describe("reconcile news history hook", () => {
  it("keeps GET read-only and POST authenticated", () => {
    expect(source).toContain("GET: ({ request }) => reconcile(request, false)");
    expect(source).toContain("POST: ({ request }) => reconcile(request, true)");
    expect(source).toContain("if (apply && !isAuthorizedApply(request))");
    expect(source).toContain("NEWSROOM_HOOK_TOKEN");
  });

  it("does not write daily_articles or alter article slugs", () => {
    expect(source).not.toMatch(/from\(["']daily_articles["']\)\.update/);
    expect(source).not.toMatch(/from\(["']daily_articles["']\)\.upsert/);
    expect(source).not.toMatch(/from\(["']daily_articles["']\)\.delete/);
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

  it("holds conflicting historical canonical slugs for admin review", () => {
    expect(source).toContain('status: plan.kind === "safe" ? "backfilled" : "held_for_admin_review"');
    expect(source).toContain("hold_missing_article");
    expect(source).toContain("hold_multiple_published_slugs");
  });
});
