import { describe, expect, it } from "vitest";
import { isEligibleTextFirstFacebookArticle } from "@/lib/facebook-text-first-eligibility";

const base = {
  kind: "news",
  content_quality_score: 91,
  quality_flags: ["missing_image", "primary_sources"],
  featured_image_url: null,
};

describe("KeepTXRed requires pictures for every Facebook post", () => {
  it("rejects substantive news without a featured image", () => {
    expect(isEligibleTextFirstFacebookArticle(base)).toBe(false);
  });

  it("does not enable text-only mode even when an image exists", () => {
    expect(isEligibleTextFirstFacebookArticle({
      ...base, featured_image_url: "https://example.org/real.jpg",
    })).toBe(false);
  });

  it("blocks the old text-only override for all content kinds and scores", () => {
    for (const kind of ["news", "evergreen", "sports", null]) {
      for (const score of [0, 71, 72, 100]) {
        expect(isEligibleTextFirstFacebookArticle({
          ...base, kind, content_quality_score: score,
        })).toBe(false);
      }
    }
  });
});
