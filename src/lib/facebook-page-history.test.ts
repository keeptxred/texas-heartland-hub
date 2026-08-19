import { describe, expect, it } from "vitest";
import {
  canonicalKtrArticlePath,
  facebookHeadlineSimilarity,
  facebookPostMatchesArticle,
  normalizeFacebookHeadline,
} from "./facebook-page-history";

describe("facebook page history duplicate detection", () => {
  it("normalizes KeepTXRed URLs by host and path", () => {
    expect(canonicalKtrArticlePath("https://www.keeptxred.com/news/example-story/?utm_source=facebook"))
      .toBe("/news/example-story");
  });

  it("matches an article when the prior Facebook message contains its KTR path", () => {
    expect(
      facebookPostMatchesArticle(
        { message: "Read this update\n\nhttps://www.keeptxred.com/news/2026-08-09-houston-flock-camera-backlash?utm_source=facebook" },
        {
          title: "Flock Camera Backlash Spreads Across the Houston Region as Privacy Fight Intensifies",
          url: "https://keeptxred.com/news/2026-08-09-houston-flock-camera-backlash",
        },
      ),
    ).toBe(true);
  });

  it("matches an exact normalized headline even when punctuation changes", () => {
    expect(
      facebookPostMatchesArticle(
        { message: "Flock Camera Backlash Spreads Across the Houston Region — as Privacy Fight Intensifies!" },
        {
          title: "Flock Camera Backlash Spreads Across the Houston Region as Privacy Fight Intensifies",
          url: "https://keeptxred.com/news/flock-camera-backlash",
        },
      ),
    ).toBe(true);
  });

  it("matches a near-identical rewritten headline but not merely related coverage", () => {
    const original = "Flock Camera Backlash Spreads Across the Houston Region as Privacy Fight Intensifies";
    const nearDuplicate = "Houston Region Flock Camera Backlash Spreads as Privacy Fight Intensifies";
    const related = "Houston Officials Debate New Rules for Police Technology and Public Records";
    expect(facebookHeadlineSimilarity(original, nearDuplicate)).toBeGreaterThanOrEqual(0.86);
    expect(facebookHeadlineSimilarity(original, related)).toBeLessThan(0.86);
  });

  it("does not treat generic Texas wording as a duplicate", () => {
    expect(normalizeFacebookHeadline("Texas election update")).toBe("texas election update");
    expect(
      facebookPostMatchesArticle(
        { message: "Texas election update: Senate candidates debate taxes" },
        {
          title: "Texas House advances school funding proposal",
          url: "https://keeptxred.com/news/school-funding-proposal",
        },
      ),
    ).toBe(false);
  });
});
