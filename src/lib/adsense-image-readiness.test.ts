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

describe("AdSense-ready image backfill", () => {
  it("is restricted to GitHub Actions OIDC from the dedicated workflow", () => {
    expect(route).toContain("verifyGitHubActionsOidc");
    expect(route).toContain('const WORKFLOW_PATH = ".github/workflows/adsense-image-backfill.yml"');
    expect(route).toContain("if (!(await authorized(request)))");
    expect(workflow).toContain("id-token: write");
    expect(workflow).toContain("audience=keeptxred-newsroom");
  });

  it("selects only articles already approved by the AdSense readiness audit", () => {
    expect(route).toContain('.from("adsense_cloud_article_readiness")');
    expect(route).toContain('.eq("adsense_ready", true)');
  });

  it("uses the existing verified featured-image generator without becoming a new article writer", () => {
    expect(route).toContain("generateFeaturedImageForSlugDirect(slug, false)");
    expect(route).toContain("if (!generated.ok)");
    expect(route).not.toContain('.update({ quality_flags:');
  });

  it("clears missing_image centrally only when featured_image_url exists", () => {
    expect(migration).toContain("clear_missing_image_when_ready");
    expect(migration).toContain("NEW.featured_image_url IS NOT NULL");
    expect(migration).toContain("array_remove(coalesce(NEW.quality_flags, ARRAY[]::text[]), 'missing_image')");
    expect(migration).toContain("BEFORE INSERT OR UPDATE OF featured_image_url");
  });

  it("runs after the verified Cloudflare production deployment completes", () => {
    expect(workflow).toContain("workflow_run:");
    expect(workflow).toContain('workflows: ["Deploy verified KeepTXRed to Cloudflare"]');
    expect(workflow).toContain("github.event.workflow_run.conclusion == 'success'");
    expect(workflow).toContain("dry=1");
    expect(workflow).toContain("limit=2&offset=${offset}");
    expect(workflow).not.toContain("push:");
  });
});
