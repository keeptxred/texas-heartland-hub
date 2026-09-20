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
    expect(source).toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(source).toContain('request.headers.get("x-reconcile-service-role-key") === serviceRoleKey');
  });

  it("pages beyond the Supabase 1000-row response cap", () => {
    expect(source).toContain("const MAX_LIMIT = 5000");
    expect(source).toContain("const PAGE_SIZE = 1000");
    expect(source).toContain("fetchHistoricalFeedRows");
    expect(source).toContain(".range(from, to)");
    expect(source).toContain("if (batch.length < expected) break");
    expect(source).toContain("limit,");
  });

  it("does not write daily_articles or alter article slugs or publication timestamps", () => {
    expect(source).not.toMatch(/from\(["']daily_articles["']\)\.update/);
    expect(source).not.toMatch(/from\(["']daily_articles["']\)\.upsert/);
    expect(source).not.toMatch(/from\(["']daily_articles["']\)\.delete/);
    expect(source).toContain('select("slug,title,published_at,body_json")');
    expect(source).toContain("articleWrites: 0");
    expect(source).toContain("slugChanges: 0");
  });

  it("uses deterministic event persistence and structured fact provenance with no AI", () => {
    expect(source).toContain("persistEventCluster");
    expect(source).toContain("buildStructuredFactLedger");
    expect(source).toContain("persistStructuredFacts");
    expect(source).toContain("aiCalls: 0");
    expect(source).not.toContain("runCloudflareJson");
    expect(source).not.toContain("KTR_AI_PROVIDER_READY");
  });

  it("queues ambiguous and contaminated history for review without assigning cluster ownership", () => {
    expect(source).toContain('if (plan.kind === "hold")');
    expect(source).toContain("multiple-slugs:${plan.feedItemIds[0]}");
    expect(source).toContain("source-material-contamination:${plan.feedItemIds[0]}");
    expect(source).toContain('plan.holdType === "source_material_contamination"');
    expect(source).toContain('"hold_source_material_contamination"');
    const holdBranch = source.slice(source.indexOf('if (plan.kind === "hold")'), source.indexOf("const missingSlugs"));
    expect(holdBranch).toContain("recordHold");
    expect(holdBranch).toContain('"source_material_contamination"');
    expect(holdBranch).not.toContain("persistEventCluster");
    expect(source).toContain("held_for_admin_review");
    expect(migration).toContain("news_event_reconciliation_holds");
    expect(migration).toContain("review_status");
  });

  it("validates legacy slug ownership against article editorial evidence before backfill", () => {
    expect(source).toContain("historicalArticleOwnershipCompatible");
    expect(source).toContain("articleEditorialEvidence");
    expect(source).toContain("slugOwners");
    expect(source).toContain("canonical_article_identity_mismatch");
    expect(source).toContain("hold_canonical_identity_mismatch");
    const ownershipBranch = source.slice(source.indexOf("const ownsCanonicalArticle"), source.indexOf("if (!apply)"));
    expect(ownershipBranch).toContain("recordHold");
    expect(ownershipBranch).not.toContain("persistEventCluster");
  });

  it("restores historical cluster timestamps instead of making backfill look newly published", () => {
    expect(source).toContain("historicalBounds(plan)");
    expect(source).toContain("historicalTimestamps.published_at = article.published_at");
    expect(source).toContain("historicalTimestamps.synthesized_at = article.published_at");
  });
});
