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

describe("AdSense restored Texas law library readiness", () => {
  it("keeps every verified law guide paired with substantive, source-backed content", () => {
    const verified = LAW_GUIDES.filter((guide) => guide.status === "verified");
    const violations = verified.flatMap((meta) => {
      const guide = SUPPORTING_GUIDES[meta.slug];
      if (!guide) return [`${meta.slug}: missing SUPPORTING_GUIDES content`];

      const blockers: string[] = [];
      const words = supportingGuideWordCount(guide);
      if (words < MIN_SUPPORTING_GUIDE_WORDS) blockers.push(`words=${words}<${MIN_SUPPORTING_GUIDE_WORDS}`);
      if (guide.faq.length < MIN_SUPPORTING_GUIDE_FAQS) blockers.push(`faq=${guide.faq.length}<${MIN_SUPPORTING_GUIDE_FAQS}`);
      if (guide.sources.length < MIN_SUPPORTING_GUIDE_SOURCES) blockers.push(`sources=${guide.sources.length}<${MIN_SUPPORTING_GUIDE_SOURCES}`);
      if (!meta.sources?.some((source) => source.primary)) blockers.push("missing primary metadata source");
      if (!meta.lastVerified) blockers.push("missing lastVerified");
      if (!isSupportingGuideIndexable(guide)) blockers.push("readiness gate=false");

      return blockers.length ? [`${meta.slug}: ${blockers.join(", ")}`] : [];
    });

    expect(verified.length).toBeGreaterThanOrEqual(200);
    expect(violations, violations.join("\n")).toEqual([]);
  });
});
