import fs from "node:fs";
import { describe, expect, it } from "vitest";

const route = fs.readFileSync(
  new URL("../routes/api/public/hooks/adsense-image-backfill.ts", import.meta.url),
  "utf8",
);
const workflow = fs.readFileSync(
  new URL("../../.github/workflows/adsense-image-backfill.yml", import.meta.url),
  "utf8",
);
const migration = fs.readFileSync(
  new URL("../../supabase/migrations/20260818054000_clear_missing_image_when_ready.sql", import.meta.url),
  "utf8",
);

describe("fresh article image recovery", () => {
  it("is restricted to GitHub Actions OIDC from the dedicated workflow", () => {
    expect(route).toContain("verifyGitHubActionsOidc");
    expect(route).toContain('const WORKFLOW_PATH = ".github/workflows/adsense-image-backfill.yml"');
    expect(route).toContain("if (!(await authorized(request)))");
    expect(workflow).toContain("id-token: write");
    expect(workflow).toContain("audience=keeptxred-newsroom");
  });

  it("recovers every fresh substantive article instead of only the AdSense subset", () => {
    expect(route).toContain('.from("daily_articles")');
    expect(route).toContain("FACEBOOK_FRESHNESS_DAYS = 4");
    expect(route).toContain("meetsArticleMainWordCount(row.kind, row.body_json)");
    expect(route).toContain('scope: "fresh_quality_articles"');
    expect(route).not.toContain('.from("adsense_cloud_article_readiness")');
    expect(route).not.toContain('.eq("adsense_ready", true)');
  });

  it("repairs one exact eligible slug with verified overwrite semantics", () => {
    expect(route).toContain('const requestedSlug = (url.searchParams.get("slug") ?? "").trim()');
    expect(route).toContain("if (!slugs.includes(requestedSlug))");
    expect(route).toContain("generateFeaturedImageForSlugDirect(requestedSlug, true)");
    expect(route).not.toContain('.update({ quality_flags:');
  });

  it("clears missing_image centrally only when featured_image_url exists", () => {
    expect(migration).toContain("clear_missing_image_when_ready");
    expect(migration).toContain("NEW.featured_image_url IS NOT NULL");
    expect(migration).toContain("array_remove(coalesce(NEW.quality_flags, ARRAY[]::text[]), 'missing_image')");
    expect(migration).toContain("BEFORE INSERT OR UPDATE OF featured_image_url");
  });

  it("retries a bounded batch every four hours and after verified deployments", () => {
    expect(workflow).toContain('cron: "47 */4 * * *"');
    expect(workflow).toContain("workflow_run:");
    expect(workflow).toContain('workflows: ["Deploy verified KeepTXRed to Cloudflare"]');
    expect(workflow).toContain("github.event_name == 'schedule'");
    expect(workflow).toContain("github.event.workflow_run.conclusion == 'success'");
    expect(workflow).toContain("max_per_run=8");
    expect(workflow).toContain("dry=1");
    expect(workflow).toContain(".slugs[:$max][]");
    expect(workflow).toContain('"${endpoint}?slug=${encoded_slug}"');
    expect(workflow).toContain("ready=0; image queue already clean");
    expect(workflow).not.toContain("for offset in 0 2 4");
    expect(workflow).not.toContain("push:");
  });
});
