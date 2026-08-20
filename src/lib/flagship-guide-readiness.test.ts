import { describe, expect, it } from "vitest";
import { ALL_GUIDES, supportingGuidesForPillar } from "@/data/all-guides";
import {
  MIN_SUPPORTING_GUIDE_WORDS,
  isSupportingGuideIndexable,
  supportingGuideWordCount,
} from "@/lib/supporting-guide-indexability";

const READY_FLAGSHIPS = [
  {
    slug: "texas-veterans-military-guide",
    pillarHref: "/texas-veterans",
  },
  {
    slug: "texas-law-enforcement-public-safety-guide",
    pillarHref: "/texas-law-enforcement",
  },
] as const;

describe("upgraded flagship guide readiness", () => {
  for (const { slug, pillarHref } of READY_FLAGSHIPS) {
    it(`${slug} genuinely clears the canonical publication gate`, () => {
      const guide = ALL_GUIDES[slug];
      expect(guide).toBeDefined();
      expect(supportingGuideWordCount(guide)).toBeGreaterThanOrEqual(MIN_SUPPORTING_GUIDE_WORDS);
      expect(guide.intro.length).toBeGreaterThanOrEqual(2);
      expect(guide.sections.length).toBeGreaterThanOrEqual(5);
      expect(guide.faq.length).toBeGreaterThanOrEqual(4);
      expect(guide.sources.filter((source) => /^https:\/\//i.test(source.url)).length).toBeGreaterThanOrEqual(4);
      expect(isSupportingGuideIndexable(guide)).toBe(true);
    });

    it(`${slug} is discoverable through its pillar only after readiness filtering`, () => {
      const guides = supportingGuidesForPillar(pillarHref);
      const flagship = guides.find((guide) => guide.slug === slug);
      expect(flagship).toBeDefined();
      expect(isSupportingGuideIndexable(flagship!)).toBe(true);
    });
  }
});
