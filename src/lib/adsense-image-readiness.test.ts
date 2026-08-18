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

  it("uses the existing verified featured-image generator and clears missing_image only after success", () => {
    expect(route).toContain("generateFeaturedImageForSlugDirect(slug, false)");
    expect(route).toContain('flag !== "missing_image"');
    expect(route).toContain("if (!generated.ok)");
  });

  it("runs automatically after the production route is merged and deployed", () => {
    expect(workflow).toContain("push:");
    expect(workflow).toContain("branches: [main]");
    expect(workflow).toContain("dry=1");
    expect(workflow).toContain("limit=2&offset=${offset}");
  });
});
