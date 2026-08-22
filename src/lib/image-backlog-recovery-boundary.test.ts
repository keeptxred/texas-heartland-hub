import fs from "node:fs";
import { describe, expect, it } from "vitest";

describe("image backlog recovery publication boundary", () => {
  it("excludes unpublished rows before any image generation", () => {
    const source = fs.readFileSync(new URL("../routes/api/public/hooks/image-backlog-recovery.ts", import.meta.url), "utf8");
    const eligibleStart = source.indexOf("function isEligible");
    const eligibleEnd = source.indexOf("function priority");
    const eligibleSource = source.slice(eligibleStart, eligibleEnd);

    expect(eligibleSource).toContain("if (!row.published_at) return false;");
    expect(eligibleSource).toContain('status !== "pending" && status !== "failed"');
    expect(eligibleSource).toContain("row.featured_image_url?.trim()");
    expect(eligibleSource).toContain("meetsArticleMainWordCount");
    expect(source).toContain("missing_published_quality_article_images_pending_first");
  });
});
