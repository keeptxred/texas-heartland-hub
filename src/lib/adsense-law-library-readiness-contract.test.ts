import { describe, expect, it } from "vitest";
import { SUPPORTING_GUIDES } from "@/data/all-guides";
import { LAW_GUIDES } from "@/lib/law-guides";
import {
  MIN_SUPPORTING_GUIDE_FAQS,
  MIN_SUPPORTING_GUIDE_SOURCES,
  MIN_SUPPORTING_GUIDE_WORDS,
  isSupportingGuideIndexable,
  supportingGuideWordCount,
} from "@/lib/supporting-guide-indexability";

describe("AdSense Texas law library readiness contract", () => {
  it("never treats verified legal metadata as a substitute for content readiness", () => {
    const verified = LAW_GUIDES.filter((meta) => meta.status === "verified");
    expect(verified.length).toBeGreaterThan(0);

    for (const meta of verified) {
      const guide = SUPPORTING_GUIDES[meta.slug];
      expect(guide, `${meta.slug}: verified metadata must have matching guide content`).toBeDefined();
      if (!guide) continue;

      const hasVerifiedMetadata = Boolean(
        meta.lastVerified && meta.sources?.length && meta.sources.some((source) => source.primary),
      );
      const meetsContentReadiness =
        supportingGuideWordCount(guide) >= MIN_SUPPORTING_GUIDE_WORDS &&
        guide.faq.length >= MIN_SUPPORTING_GUIDE_FAQS &&
        guide.sources.length >= MIN_SUPPORTING_GUIDE_SOURCES &&
        guide.keyTakeaways.length > 0 &&
        guide.sections.length > 0;

      expect(hasVerifiedMetadata, `${meta.slug}: verified metadata is incomplete`).toBe(true);
      expect(
        isSupportingGuideIndexable(guide),
        `${meta.slug}: indexability must require both verified metadata and substantive content`,
      ).toBe(hasVerifiedMetadata && meetsContentReadiness);
    }
  });

  it("keeps every below-threshold verified law guide out of the index-ready cohort", () => {
    const belowThreshold = LAW_GUIDES.filter((meta) => meta.status === "verified")
      .map((meta) => SUPPORTING_GUIDES[meta.slug])
      .filter((guide): guide is NonNullable<typeof guide> => Boolean(guide))
      .filter((guide) =>
        supportingGuideWordCount(guide) < MIN_SUPPORTING_GUIDE_WORDS ||
        guide.faq.length < MIN_SUPPORTING_GUIDE_FAQS ||
        guide.sources.length < MIN_SUPPORTING_GUIDE_SOURCES ||
        guide.keyTakeaways.length === 0 ||
        guide.sections.length === 0,
      );

    expect(belowThreshold.every((guide) => !isSupportingGuideIndexable(guide))).toBe(true);
  });
});
