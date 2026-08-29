import fs from "node:fs";
import { describe, expect, it } from "vitest";

describe("image backlog recovery publication boundary", () => {
  it("keeps recovery published-only and quality-gated while including blocked legacy assets", () => {
    const source = fs.readFileSync(new URL("../routes/api/public/hooks/image-backlog-recovery.ts", import.meta.url), "utf8");
    const eligibleStart = source.indexOf("function isEligible");
    const eligibleEnd = source.indexOf("function priority");
    const eligibleSource = source.slice(eligibleStart, eligibleEnd);

    expect(eligibleSource).toContain("if (!row.published_at) return false;");
    expect(eligibleSource).toContain("meetsArticleMainWordCount");
    expect(eligibleSource).toContain("isLegacyGeneratedNewsAsset(row.featured_image_url)");
    expect(eligibleSource).toContain('status === "pending" || status === "failed"');
    expect(eligibleSource).toContain('status === "pending" || status === "failed" || status === "ready"');
    expect(source).toContain('.is("featured_image_url", null)');
    expect(source).toContain('.like("featured_image_url", "%/images/news/generated/%")');
    expect(source).toContain('.from("adsense_cloud_article_readiness")');
    expect(source).toContain('.eq("adsense_ready", true)');
    expect(source).toContain('.eq("image_ready", false)');
    expect(source).toContain("byAdSensePriority");
    expect(source).toContain("adsensePriorityResult.error");
    expect(source).toContain("adsense_ready_missing_first_then_missing_or_legacy_published_quality_article_images");
  });

  it("returns only stale published missing-image generation leases through the registered image writer", () => {
    const routeSource = fs.readFileSync(new URL("../routes/api/public/hooks/image-backlog-recovery.ts", import.meta.url), "utf8");
    const writerSource = fs.readFileSync(new URL("./featured-image.functions.ts", import.meta.url), "utf8");

    expect(routeSource).toContain("resetStaleFeaturedImageGenerationLeasesDirect");
    expect(routeSource).toContain("staleResetResult.error");
    expect(routeSource).toContain("staleReset");
    expect(routeSource).not.toContain('.update({\n      image_generation_status: "failed"');

    expect(writerSource).toContain("const STALE_GENERATION_LEASE_MS = 20 * 60 * 1000;");
    expect(writerSource).toContain("export async function resetStaleFeaturedImageGenerationLeasesDirect");
    expect(writerSource).toContain('.is("featured_image_url", null)');
    expect(writerSource).toContain('.eq("image_generation_status", "generating")');
    expect(writerSource).toContain('.not("published_at", "is", null)');
    expect(writerSource).toContain('.lt("updated_at", staleBefore)');
    expect(writerSource).toContain('image_generation_status: "failed"');
    expect(writerSource).toContain("Image generation lease expired before completion; returned to guarded recovery backlog.");
  });
});
