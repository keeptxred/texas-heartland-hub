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
  it("accepts only the exact pre-vetted public-domain Cuellar portrait for the named article", () => {
    const url = "https://commons.wikimedia.org/wiki/Special:Redirect/file/Henry_Cuellar,_official_portrait.jpg";
    const slug = "2026-10-14-house-republicans-pull-3-million-reserved-for-ads-against-henry-cuellar";
    expect(hasHeroVisualReadinessProvenance("authoritative-image-exempt: U.S. House public-domain original, official portrait of Henry Cuellar (2017)", url, slug)).toBe(true);
    expect(hasHeroVisualReadinessProvenance("authoritative-image-exempt: someone else's picture", url, "unrelated")).toBe(false);
    expect(hasHeroVisualReadinessProvenance("authoritative-image-exempt: same subject", "https://example.com/other.jpg", slug)).toBe(false);
  });
});
