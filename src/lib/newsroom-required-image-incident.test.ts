import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { newsroomAbstractPolicyVisualSubject } from "./featured-image.functions";
import { hasHeroVisualReadinessProvenance } from "./article-hero-readiness";
import type { SubjectExtract } from "./featured-image-core";

const base: SubjectExtract = {
  title: "Newsroom title",
  domain: "legal",
  firstParagraph: "A government filing was reported.",
  entities: [],
  locations: [],
  concreteSubject: "Generic court scene",
};

const cases: Array<[string, string, string]> = [
  ["2026-10-15-texas-appeals-order-requiring-prison-air-conditioning", "air-conditioning", "inmates"],
  ["2026-10-14-san-antonio-files-federal-suit-over-ice-facility-environmental-review", "warehouse", "ICE operation"],
  ["2026-10-14-texas-sued-for-failing-to-process-over-500-000-voter-registrations", "voter-registration", "ballots"],
  ["2026-10-14-texas-penalties-for-data-center-violations-are-light-despite-tough-talk-from-abb", "cooling-water", "server-rack room"],
];

describe("newsroom exact image recovery for October failed visual topics", () => {
  for (const [slug, essential, mustNotInvent] of cases) {
    it(`requires actual story-specific physical subject for ${slug}`, () => {
      const image = newsroomAbstractPolicyVisualSubject({ slug, title: "Reported Texas action" }, base);
      expect(image).not.toBe(base);
      expect(image.title).toBe("Reported Texas action");
      expect(image.imageGroundingMode).toBe("verified_symbolic");
      expect(image.concreteSubject).toContain(essential);
      expect(image.concreteSubject).toContain(mustNotInvent);
      expect(image.evidenceGuidance).toContain("No fabricated");
    });
  }
  it("does not alter unrelated newsroom image criteria", () => {
    expect(newsroomAbstractPolicyVisualSubject({ slug: "2026-10-01-unrelated", title: "Other story" }, base)).toBe(base);
  });
  it("does not treat an unvalidated archival image as approved solely by its URL", () => {
    const url = "https://commons.wikimedia.org/wiki/Special:Redirect/file/Henry_Cuellar,_official_portrait.jpg";
    const slug = "2026-10-14-house-republicans-pull-3-million-reserved-for-ads-against-henry-cuellar";
    expect(hasHeroVisualReadinessProvenance("authoritative-image-exempt: public-domain archive portrait", url, slug)).toBe(false);
    expect(hasHeroVisualReadinessProvenance("stored-cloudflare-vision-v4 ok: verified named subject in image", url, slug)).toBe(true);
    expect(hasHeroVisualReadinessProvenance("authoritative-image-exempt: photo", "https://example.com/other.jpg", slug)).toBe(false);
  });
});

describe("image is required before a newsroom article can become public", () => {
  it("creates and validates a hero before the daily_articles upsert", () => {
    const source = readFileSync("src/routes/api/public/hooks/generate-newsroom.ts", "utf8");
    const prepareIndex = source.indexOf("await prepareFeaturedImageForUnpublishedNewsroomArticle({");
    const guardIndex = source.indexOf("newsroom_image_publication_hold");
    const insertIndex = source.indexOf(".upsert(readyRow, { onConflict: \"slug\" })");
    expect(prepareIndex).toBeGreaterThan(0);
    expect(guardIndex).toBeGreaterThan(prepareIndex);
    expect(insertIndex).toBeGreaterThan(guardIndex);
    expect(source).not.toContain(".upsert(row, { onConflict: \"slug\" })");
    expect(source).toContain('image_generation_status: "ready"');
    expect(source).toContain('image_validation_note: preparedImage.imageValidationNote');
  });
  it("runs image storage/vision without needing a published daily_articles row", () => {
    const source = readFileSync("src/lib/featured-image.functions.ts", "utf8");
    expect(source).toContain("beforePublish?: boolean");
    expect(source).toContain("if (!opts.beforePublish)");
    expect(source).toContain("return generateAndStore(row, { beforePublish: true })");
    expect(source).toContain("if (!verdict.matches) throw new Error");
  });
  it("rejects missing hero finalization instead of reporting a successful text-only release", () => {
    const source = readFileSync("src/routes/api/public/hooks/finalize-newsroom-article.ts", "utf8");
    expect(source).toContain('error: "newsroom_featured_image_required"');
    expect(source).toContain("status: image.ok ? 200 : 422");
  });
});
