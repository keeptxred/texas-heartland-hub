import { describe, expect, it } from "vitest";
import { isEligibleTextFirstFacebookArticle } from "@/lib/facebook-text-first-eligibility";

const base = {
  kind: "news",
  content_quality_score: 91,
  quality_flags: ["missing_image", "primary_sources"],
  featured_image_url: null,
};

describe("KeepTXRed text-first Facebook eligibility", () => {
  it("permits a substantive image-less newsroom article", () => {
    expect(isEligibleTextFirstFacebookArticle(base)).toBe(true);
  });
  it("never substitutes text for a ready or invalid supplied image", () => {
    expect(isEligibleTextFirstFacebookArticle({ ...base, featured_image_url: "https://example.org/real.jpg" })).toBe(false);
  });
  it("rejects low-value, quarantined, duplicated and non-news content", () => {
    expect(isEligibleTextFirstFacebookArticle({ ...base, kind: "evergreen" })).toBe(false);
    expect(isEligibleTextFirstFacebookArticle({ ...base, content_quality_score: 71 })).toBe(false);
    for (const flag of ["seo_noindex", "source_integrity_failure", "seo_false_multisource", "internal_repetition", "duplicate_story", "seo_low_value_commodity", "chatgpt-admin-ignored", "seo_off_topic"]) {
      expect(isEligibleTextFirstFacebookArticle({ ...base, quality_flags: [flag] })).toBe(false);
    }
  });
});
