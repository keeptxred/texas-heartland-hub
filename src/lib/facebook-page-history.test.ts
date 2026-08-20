import { describe, expect, it } from "vitest";
import {
  canonicalArticleUrlKey,
  canonicalKtrArticlePath,
  facebookHeadlineSimilarity,
  facebookPostMatchesArticle,
  normalizeFacebookHeadline,
} from "./facebook-page-history";

const legacyKtrHost = ["www", "keeptxred.com"].join(".");
const legacyKtrUrl = (path: string) => `https://${legacyKtrHost}${path}`;

describe("facebook page history duplicate detection", () => {
  it("normalizes KeepTXRed URLs by host and path", () => {
    const legacyUrl = legacyKtrUrl("/news/example-story/?utm_source=facebook");
    expect(canonicalKtrArticlePath(legacyUrl)).toBe("/news/example-story");
    expect(canonicalArticleUrlKey(legacyUrl)).toBe("keeptxred.com/news/example-story");
  });

  it("matches an article when the prior Facebook message contains its KTR path", () => {
    expect(
      facebookPostMatchesArticle(
        {
          message: `Read this update\n\n${legacyKtrUrl(
            "/news/2026-08-09-houston-flock-camera-backlash?utm_source=facebook",
          )}`,
        },
        {
          title: "Flock Camera Backlash Spreads Across the Houston Region as Privacy Fight Intensifies",
          url: "https://keeptxred.com/news/2026-08-09-houston-flock-camera-backlash",
        },
      ),
    ).toBe(true);
  });

  it("matches a prior admin post that used the original source URL before a KTR article existed", () => {
    expect(
      facebookPostMatchesArticle(
        {
          message:
            "Houston-area communities push back on Flock surveillance cameras\n\nhttps://www.houstonchronicle.com/news/houston-texas/article/flock-surveillance-cameras-backlash-22363916.php?utm_source=facebook",
        },
        {
          title: "Flock Camera Backlash Spreads Across the Houston Region as Privacy Fight Intensifies",
          url: "https://keeptxred.com/news/2026-08-09-houston-flock-camera-backlash",
          alternateUrls: [
            "https://www.houstonchronicle.com/news/houston-texas/article/flock-surveillance-cameras-backlash-22363916.php",
          ],
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
