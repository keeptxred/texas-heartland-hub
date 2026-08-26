import { describe, expect, it } from "vitest";
import { ALL_GUIDES } from "@/data/all-guides";
import {
  KTR_DURABLE_FACEBOOK_GUIDES,
  durableGuideCanonicalUrl,
} from "@/lib/facebook-durable-guides";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import { isSupportingGuideIndexable } from "@/lib/supporting-guide-indexability";

describe("KTR durable Facebook guide pool", () => {
  it("includes every production-indexable guide without an age cutoff", () => {
    const expected = Object.values(ALL_GUIDES).filter(isSupportingGuideIndexable);
    expect(KTR_DURABLE_FACEBOOK_GUIDES).toHaveLength(expected.length);
    expect(KTR_DURABLE_FACEBOOK_GUIDES.length).toBeGreaterThan(0);
    expect(new Set(KTR_DURABLE_FACEBOOK_GUIDES.map((guide) => guide.slug))).toEqual(
      new Set(expected.map((guide) => guide.slug)),
    );
  });

  it("uses canonical KTR URLs and a production-safe share image", () => {
    for (const guide of KTR_DURABLE_FACEBOOK_GUIDES) {
      expect(guide.url).toBe(durableGuideCanonicalUrl(guide.slug));
      expect(guide.url).toMatch(/^https:\/\/keeptxred\.com\//);
      expect(guide.image_url).toBe(DEFAULT_OG_IMAGE);
      expect(guide.kind).toBe("evergreen-guide");
      expect(guide.is_breaking).toBe(false);
    }
  });
});
