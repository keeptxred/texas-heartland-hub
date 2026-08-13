import { describe, expect, it } from "vitest";
import {
  LAW_GUIDES,
  LAW_TOPICS,
  createDraftLawGuideMeta,
  isLawGuideIndexable,
  isLawGuideMetaIndexable,
  validateLawGuideMeta,
  type LawGuideMeta,
} from "@/lib/law-guides";

describe("law guide registry", () => {
  it("uses unique topic keys and guide slugs", () => {
    const topicKeys = Object.keys(LAW_TOPICS);
    const slugs = LAW_GUIDES.map((guide) => guide.slug);
    expect(new Set(topicKeys).size).toBe(topicKeys.length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("creates new entries as drafts", () => {
    const draft = createDraftLawGuideMeta("sample-guide", "driving");
    expect(draft.status).toBe("draft");
    expect(isLawGuideMetaIndexable(draft)).toBe(false);
  });

  it("requires metadata for verified status", () => {
    const incomplete: LawGuideMeta = {
      slug: "sample-guide",
      topic: "consumer",
      status: "verified",
    };
    expect(validateLawGuideMeta(incomplete).length).toBeGreaterThan(0);
  });

  it("accepts complete verified metadata", () => {
    const complete: LawGuideMeta = {
      slug: "sample-guide",
      topic: "consumer",
      status: "verified",
      lastVerified: "2026-08-13",
      sources: [
        {
          label: "Official source",
          url: "https://statutes.capitol.texas.gov/",
          primary: true,
        },
      ],
    };
    expect(validateLawGuideMeta(complete)).toEqual([]);
    expect(isLawGuideMetaIndexable(complete)).toBe(true);
  });

  it("preserves existing content behavior", () => {
    expect(isLawGuideIndexable(LAW_GUIDES[0].slug)).toBe(true);
    expect(isLawGuideIndexable("unregistered-existing-article")).toBe(true);
  });
});
