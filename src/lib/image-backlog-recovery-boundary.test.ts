import fs from "node:fs";
import { describe, expect, it } from "vitest";

describe("image backlog recovery publication boundary", () => {
  it("executes exact emergency images only after verified production deployment, never predeploy", () => {
    const workflow = fs.readFileSync(".github/workflows/image-backlog-recovery.yml", "utf8");
    expect(workflow).toContain('workflows: ["Deploy verified KeepTXRed to Cloudflare"]');
    expect(workflow).toContain('verified_message=$(gh api');
    expect(workflow).toContain('[run-image-backlog]');
    expect(workflow).not.toContain('workflows: ["Repository test and build health"]');
    expect(workflow).toContain('load_exact_marker_slugs');
    expect(workflow).toContain('max_per_run=4');

    const marker = fs.readFileSync(".github/force-image-backlog-recovery", "utf8");
    const slugs = marker.split(/\r?\n/).filter((line) => line.startsWith("slug:"));
    expect(slugs).toEqual([
      "slug:2026-10-14-san-antonio-files-federal-suit-over-ice-facility-environmental-review",
      "slug:2026-10-14-texas-sued-for-failing-to-process-over-500-000-voter-registrations",
    ]);
  });
  it("keeps recovery published-only and quality-gated while including blocked legacy assets", () => {
    const source = fs.readFileSync(new URL("../routes/api/public/hooks/image-backlog-recovery.ts", import.meta.url), "utf8");
    const eligibleStart = source.indexOf("function isEligible");
    const eligibleEnd = source.indexOf("function isAlreadyRecovered");
    const eligibleSource = source.slice(eligibleStart, eligibleEnd);

    expect(eligibleSource).toContain("if (!row.published_at) return false;");
    expect(eligibleSource).toContain("if (row.image_candidate_url?.trim()");
    expect(eligibleSource).toContain('=== "pending"');
    expect(eligibleSource).toContain('startsWith("hero-readiness hold:")');
    expect(source).toContain("image_candidate_url,image_generation_status");
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
    expect(source).toContain("RECOVERY_SCOPE");
  });

  it("makes force-marker retries idempotent only for governed-ready published heroes", () => {
    const source = fs.readFileSync(new URL("../routes/api/public/hooks/image-backlog-recovery.ts", import.meta.url), "utf8");
    const recoveredStart = source.indexOf("function isAlreadyRecovered");
    const recoveredEnd = source.indexOf("function priority");
    const recoveredSource = source.slice(recoveredStart, recoveredEnd);

    expect(recoveredSource).toContain("if (!row?.published_at) return false;");
    expect(recoveredSource).toContain("meetsArticleMainWordCount");
    expect(recoveredSource).toContain("isLegacyGeneratedNewsAsset(imageUrl)");
    expect(recoveredSource).toContain('!== "ready"');
    expect(recoveredSource).toContain("hasHeroVisualReadinessProvenance(row.image_validation_note, imageUrl, row.slug)");
    expect(source).toContain('reason: "already-ready"');
    expect(source).toContain("processed: 0");
    expect(source).toContain("skipped: 1");
    expect(source).toContain('.eq("slug", requestedSlug)');
    expect(source).toContain("Slug is not currently an eligible published image-recovery backlog item");
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
    expect(writerSource).toContain('.not("image_candidate_url", "is", null)');
    expect(writerSource).toContain('.like("image_validation_note", "stored-cloudflare-vision-v4 rejected:%")');
    expect(writerSource).toContain('.update({ image_generation_status: "failed" })');
    // Preserve the visual rejection on an expired generator lease to stop
    // repeated audits of the same known-unrelated third-party photograph.
    expect(writerSource).toContain('.lt("updated_at", staleBefore)');
    expect(writerSource).toContain('image_generation_status: "failed"');
    expect(writerSource).toContain("Image generation lease expired before completion; returned to guarded recovery backlog.");
  });
});
