import { describe, expect, it } from "vitest";
import { ALL_GUIDES } from "@/data/all-guides";
import { getLawGuideMeta, isLawGuideIndexable, validateLawGuideMeta } from "@/lib/law-guides";

const EXPECTED = [
  "texas-hidden-camera-privacy-law",
  "texas-window-tint-law",
  "texas-knife-carry-law",
  "texas-squatter-adverse-possession-law",
] as const;

describe("high-demand Texas law authority guides", () => {
  it("publishes all four guides only through verified canonical metadata", () => {
    for (const slug of EXPECTED) {
      const meta = getLawGuideMeta(slug);
      expect(meta).not.toBeNull();
      expect(meta?.status).toBe("verified");
      expect(meta?.canonicalPath).toBe(`/guides/${slug}`);
      expect(meta?.lastVerified).toBe("2026-09-14");
      expect(meta?.statutes?.length).toBeGreaterThan(0);
      expect(meta?.sources?.some((source) => source.primary)).toBe(true);
      expect(meta ? validateLawGuideMeta(meta) : ["missing"]).toEqual([]);
      expect(isLawGuideIndexable(slug)).toBe(true);
    }
  });

  it("keeps answer depth, FAQs and primary-source links on every page", () => {
    for (const slug of EXPECTED) {
      const guide = ALL_GUIDES[slug];
      expect(guide).toBeDefined();
      expect(guide.slug).toBe(slug);
      expect(guide.pillarHref).toBe("/laws");
      expect(guide.keyTakeaways.length).toBeGreaterThanOrEqual(4);
      expect(guide.sections.length).toBeGreaterThanOrEqual(5);
      expect(guide.faq.length).toBeGreaterThanOrEqual(3);
      expect(guide.sources.length).toBeGreaterThanOrEqual(2);
      expect(guide.sources.every((source) => source.url.startsWith("https://"))).toBe(true);
    }
  });

  it("locks the material distinctions that prevent misleading search answers", () => {
    const text = (slug: (typeof EXPECTED)[number]) => {
      const guide = ALL_GUIDES[slug];
      return [
        ...guide.keyTakeaways,
        ...guide.intro,
        ...guide.sections.flatMap((section) => [...(section.paragraphs ?? []), ...(section.bullets ?? [])]),
        ...guide.faq.flatMap((item) => [item.q, item.a]),
      ].join(" ");
    };

    expect(text("texas-hidden-camera-privacy-law")).toContain("September 1, 2025");
    expect(text("texas-hidden-camera-privacy-law")).toContain("bedroom");
    expect(text("texas-window-tint-law")).toContain("25 percent");
    expect(text("texas-window-tint-law")).toContain("medical exception");
    expect(text("texas-knife-carry-law")).toContain("five and one-half inches");
    expect(text("texas-squatter-adverse-possession-law")).toContain("adverse possession");
    expect(text("texas-squatter-adverse-possession-law")).toContain("January 1, 2026");
  });
});