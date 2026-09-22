import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { missingDistributionPackagePatch } from "@/routes/api/public/hooks/prepare-distribution-packages";
import { buildArticleDistributionPackage } from "./article-distribution-package";

describe("article distribution automation", () => {
  const endpoint = readFileSync(
    new URL("../routes/api/public/hooks/prepare-distribution-packages.ts", import.meta.url),
    "utf8",
  );
  const workflow = readFileSync(
    new URL("../../.github/workflows/prepare-distribution-packages.yml", import.meta.url),
    "utf8",
  );

  it("uses the same public-quality boundary as search-facing KTR articles", () => {
    expect(endpoint).toContain("isPublicArticleReady(article)");
    expect(endpoint).toContain('import { isKeepTxRedSearchOwnedStory } from "@/lib/ktr-search-ownership"');
    expect(endpoint).toContain("isKeepTxRedSearchOwnedStory({");
    expect(endpoint).toContain("meetsArticleMainWordCount(article.kind");
    expect(endpoint).toContain("published <= now");
    expect(endpoint).toContain("MAX_ARTICLE_AGE_DAYS = 4");
  });

  it("prepares packages without another AI call or automatic social publication", () => {
    expect(endpoint).toContain("buildArticleDistributionPackage(article)");
    expect(endpoint).not.toContain("ai.internal");
    expect(endpoint).not.toContain("generateContentPackageFn");
    expect(endpoint).not.toContain("graph.facebook.com");
    expect(endpoint).not.toContain("publishing_queue");
  });

  it("fills only missing fields on an existing package", () => {
    const built = buildArticleDistributionPackage({
      slug: "test-story",
      title: "Test story",
      dek: "A reviewed summary.",
      category: "Texas Government",
      featured_image_url: "/api/public/article-image/test-story.jpg",
    });
    const patch = missingDistributionPackagePatch(
      {
        id: "package-id",
        source_url: built.sourceUrl,
        facebook_hook: "Human-written Facebook hook",
        facebook_body: null,
        facebook_cta: null,
        facebook_hashtags: null,
        instagram_hook: "Human-written Reel hook",
        instagram_script: "Human-written Reel script",
        instagram_caption: null,
        instagram_hashtags: null,
        seo_title: null,
        seo_description: null,
        seo_keywords: null,
        asset_type: null,
        asset_url: null,
        asset_notes: null,
        workflow_status: "DRAFT",
      },
      built,
    );

    expect(patch).not.toHaveProperty("facebook_hook");
    expect(patch).not.toHaveProperty("instagram_hook");
    expect(patch).not.toHaveProperty("instagram_script");
    expect(patch.facebook_body).toBe(built.facebook.body);
    expect(patch.instagram_caption).toBe(built.instagram.caption);
    expect(patch.seo_title).toBe(built.seo.title);
    expect(patch.asset_url).toBe(built.assetUrl);
    expect(patch.asset_type).toBe("IMAGE");
    expect(patch.workflow_status).toBe("ASSET_READY");
  });

  it("runs hourly with signed GitHub Actions identity and fails closed", () => {
    expect(workflow).toContain('cron: "17 * * * *"');
    expect(workflow).toContain("id-token: write");
    expect(workflow).toContain("audience=keeptxred-distribution-packages");
    expect(workflow).toContain("/api/public/hooks/prepare-distribution-packages");
    expect(workflow).toContain("DISTRIBUTION_PACKAGE_PREPARATION_FAILED");
  });
});
