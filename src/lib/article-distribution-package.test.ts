import { describe, expect, it } from "vitest";
import { buildArticleDistributionPackage } from "./article-distribution-package";

describe("article distribution package", () => {
  it("builds Facebook, vertical video, and SEO copy only from reviewed article fields", () => {
    const pkg = buildArticleDistributionPackage({
      slug: "texas-grid-test",
      title: "Raw database title",
      seo_headline: "Texas Grid Demand Reaches a New September High",
      dek: "ERCOT demand reached a new September high during a late-summer heat wave, according to the grid operator's published data.",
      category: "Energy",
      keywords: ["ERCOT", "Texas grid", "electric demand"],
      seo_keywords: ["ERCOT demand"],
      featured_image_url: "/api/public/article-image/texas-grid-test.jpg",
      body_json: {
        keyTakeaways: [
          "ERCOT reported the new September demand high.",
          "The record occurred during a late-summer heat wave.",
          "The article links to the operator's published data.",
        ],
      },
    });

    expect(pkg.sourceTitle).toBe("Texas Grid Demand Reaches a New September High");
    expect(pkg.sourceUrl).toBe("https://keeptxred.com/news/texas-grid-test");
    expect(pkg.facebook.hook).toBe(pkg.sourceTitle);
    expect(pkg.facebook.body).toContain("ERCOT demand reached");
    expect(pkg.instagram.script).toContain("ERCOT reported the new September demand high.");
    expect(pkg.instagram.script).toContain("Full context and source links are available on KeepTXRed.com.");
    expect(pkg.instagram.caption.length).toBeLessThanOrEqual(200);
    expect(pkg.seo.title.length).toBeLessThanOrEqual(60);
    expect(pkg.seo.description.length).toBeLessThanOrEqual(158);
    expect(pkg.seo.keywords).toContain("ercot demand");
    expect(pkg.facebook.hashtags).toContain("#Texas");
    expect(pkg.facebook.hashtags).toContain("#KeepTXRed");
    expect(pkg.assetUrl).toBe("/api/public/article-image/texas-grid-test.jpg");
  });

  it("falls back to the article intro instead of inventing a summary", () => {
    const pkg = buildArticleDistributionPackage({
      slug: "texas-policy-test",
      title: "Texas Policy Test",
      category: "Texas Government",
      body_json: {
        intro: ["This sentence came directly from the reviewed article body."],
      },
    });

    expect(pkg.facebook.body).toBe("This sentence came directly from the reviewed article body.");
    expect(pkg.instagram.script).toContain("This sentence came directly from the reviewed article body.");
  });
});
