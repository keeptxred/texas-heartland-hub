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
});
