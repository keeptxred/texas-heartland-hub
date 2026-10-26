import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const guard = readFileSync("src/routes/api/public/hooks/publishing-safety-net.ts", "utf8");

describe("KTR newsroom watchdog ignores historical unillustrated backfills", () => {
  it("counts only actually image-ready publications for both live and normal-news health", () => {
    const latestQuery = guard.split('const [latestAnyResult, latestAutomationResult, openAlertResult, publishedReserveResult] =')[1]
      ?.split('const readError =')[0] ?? "";
    expect(latestQuery).toContain('.from("daily_articles")');
    expect(latestQuery.match(/\.eq\("image_generation_status", "ready"\)/g)).toHaveLength(2);
    expect(latestQuery.match(/\.not\("featured_image_url", "is", null\)/g)).toHaveLength(2);
    expect(latestQuery.match(/\.neq\("featured_image_url", ""\)/g)).toHaveLength(2);
    expect(latestQuery).toContain('source_name.neq.');
    expect(latestQuery).toContain('.order("published_at", { ascending: false })');
  });

  it("does not resolve normal-news stalls from an unready backfill", () => {
    expect(guard).toContain("const automationStalled = isOlderThan24Hours(latestAutomation?.published_at ?? null)");
    expect(guard).toContain("const publicationGap = isOlderThan24Hours(latestAny?.published_at ?? null)");
    expect(guard).toContain("if (!automationStalled && openAlert)");
    expect(guard).toContain("if (automationStalled && publicationGap)");
    expect(guard).toContain("await prepareFeaturedImageForUnpublishedNewsroomArticle");
    expect(guard).toContain('image_generation_status: "ready"');
    expect(guard).toContain("reserve_newsroom_image_publication_hold:");
    expect(guard).toContain("reserve_article_publications");
  });
});
