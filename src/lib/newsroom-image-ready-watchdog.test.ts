import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const guard = readFileSync("src/routes/api/public/hooks/publishing-safety-net.ts", "utf8");

describe("KTR newsroom watchdog distinguishes verified text-first news from unverified backfills", () => {
  it("accepts images only when approved and text-only news only with its verified publisher marker", () => {
    expect(guard).toContain('row.image_generation_status === "ready" && Boolean(row.featured_image_url?.trim())');
    expect(guard).toContain('row.kind === "news" && row.author === "Keep TX Red Newsroom"');
    expect(guard).toContain('"newsroom_text_first_verified"');
    expect(guard).toContain('const qualified = ((latestArticlesResult.data ?? []) as LatestRow[]).filter(qualifiedWebsitePublication)');
    expect(guard).toContain('.limit(150)');
    // Pending-image historical imports have neither approved image nor new verified-publisher flag.
    expect(guard).not.toContain('.eq("image_generation_status", "pending")');
  });

  it("tracks the last normal non-reserve article separately from all website publications", () => {
    expect(guard).toContain("const latestAny = qualified[0] ?? null");
    expect(guard).toContain("article.source_name !== RESERVE_SOURCE");
    expect(guard).toContain("const automationStalled = isOlderThan24Hours(latestAutomation?.published_at ?? null)");
    expect(guard).toContain("const publicationGap = isOlderThan24Hours(latestAny?.published_at ?? null)");
    expect(guard).toContain("if (!automationStalled && openAlert)");
    expect(guard).toContain("if (automationStalled && publicationGap)");
    // Emergency reserve remains strictly image-validated.
    expect(guard).toContain("await prepareFeaturedImageForUnpublishedNewsroomArticle");
    expect(guard).toContain('image_generation_status: "ready"');
    expect(guard).toContain("reserve_newsroom_image_publication_hold:");
  });
});
