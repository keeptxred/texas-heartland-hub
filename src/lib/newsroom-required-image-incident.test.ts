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
  ["2026-09-29-austin-man-shot-by-ice-agent-charged-with-assault-resisting-arrest", "metal detector", "actual court"],
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
  it("illustrates the legislative committee stage instead of a generic Capitol for dated reserve articles", () => {
    const image = newsroomAbstractPolicyVisualSubject(
      { slug: "2026-10-19-how-a-texas-bill-becomes-law", title: "How a Texas Bill Becomes Law—and Where to Track It" },
      base,
    );
    expect(image).not.toBe(base);
    expect(image.domain).toBe("politics");
    expect(image.concreteSubject).toContain("bill hearing");
    expect(image.concreteSubject).toContain("document tray");
    expect(image.concreteSubject).toContain("NOT a generic Texas Capitol exterior");
    expect(image.concreteSubject).toContain("No readable signs");
    expect(image.imageGroundingMode).toBe("verified_symbolic");
    expect(image.evidenceGuidance).toContain("No fabricated");
  });
  it("makes Texas agency rulemaking visible with actual notice and comment materials, not a government facade", () => {
    const image = newsroomAbstractPolicyVisualSubject(
      { slug: "2026-10-20-how-texas-state-agencies-make-rules", title: "How Texas State Agencies Make Rules—and How the Public Can Follow Them" },
      base,
    );
    expect(image).not.toBe(base);
    expect(image.domain).toBe("general");
    expect(image.imageGroundingMode).toBe("verified_symbolic");
    expect(image.concreteSubject).toContain("proposed-rule notice");
    expect(image.concreteSubject).toContain("public-comment submission form");
    expect(image.concreteSubject).toContain("gooseneck microphones");
    expect(image.concreteSubject).toContain("EMPTY visitor chairs");
    expect(image.concreteSubject).toContain("no generic office desk");
    expect(image.concreteSubject).toContain("NO building exterior");
    expect(image.concreteSubject).toContain("completely unreadable");
    expect(image.evidenceGuidance).toContain("No fabricated");
  });
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
  it("holds legacy exact-feed and overdue publication before inserting image-free news", () => {
    const legacy = readFileSync("src/lib/ingest-feeds-legacy.ts", "utf8");
    const pre = legacy.lastIndexOf("await prepareFeaturedImageForUnpublishedNewsroomArticle({");
    const inserted = legacy.lastIndexOf(".upsert([readyArticleRow],");
    expect(pre).toBeGreaterThan(0);
    expect(inserted).toBeGreaterThan(pre);
    expect(legacy).toContain("newsroom_image_publication_hold:");
    expect(legacy).not.toContain("Fire-and-forget image generation");

    const overdue = readFileSync("src/routes/api/public/hooks/publish-overdue-gap.ts", "utf8");
    expect(overdue).toContain('result.error?.startsWith("newsroom_image_publication_hold:")');
    expect(overdue).toContain('stopping after rejected image');
  });
  it("holds emergency reserve publication unless its hero is already vision-approved", () => {
    const source = readFileSync("src/routes/api/public/hooks/publishing-safety-net.ts", "utf8");
    const prepare = source.indexOf("await prepareFeaturedImageForUnpublishedNewsroomArticle({");
    const insert = source.indexOf(".insert({", prepare);
    expect(prepare).toBeGreaterThan(0);
    expect(insert).toBeGreaterThan(prepare);
    expect(source).toContain('reserve_newsroom_image_publication_hold:');
    expect(source).toContain('image_generation_status: "ready"');
  });
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
