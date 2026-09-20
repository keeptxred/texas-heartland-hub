import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { buildFlux2ImageRequest, CLOUDFLARE_IMAGE_FALLBACK_MODEL, CLOUDFLARE_IMAGE_QUALITY_MODEL } from "./featured-image-cloudflare";

describe("Google Discover image contract", () => {
  it("keeps generated article images on the 1280x720 large-image path", () => {
    const request = buildFlux2ImageRequest("Texas news documentary photograph", "");
    expect(request.get("width")).toBe("1280");
    expect(request.get("height")).toBe("720");
    expect(Number(request.get("width"))).toBeGreaterThanOrEqual(1200);
    expect(Number(request.get("width")) / Number(request.get("height"))).toBeCloseTo(16 / 9, 4);
    expect(CLOUDFLARE_IMAGE_FALLBACK_MODEL).toBe(CLOUDFLARE_IMAGE_QUALITY_MODEL);
  });

  it("keeps large image previews and the article image wired into Open Graph and NewsArticle metadata", () => {
    const root = readFileSync(new URL("../routes/__root.tsx", import.meta.url), "utf8");
    const articleRoute = readFileSync(new URL("../routes/news.$slug.tsx", import.meta.url), "utf8");
    const seo = readFileSync(new URL("./seo.ts", import.meta.url), "utf8");

    expect(root).toContain("max-image-preview:large");
    expect(seo).toContain('{ property: "og:image", content: image }');
    expect(seo).toContain('{ name: "twitter:card", content: "summary_large_image" }');
    expect(articleRoute).toContain("image: article.image");
    expect(articleRoute).toContain("const articleImageWidth = 1280");
    expect(articleRoute).toContain("const articleImageHeight = article.slug === \"texas-policing-agencies-compared\" ? 672 : 720");
    expect(articleRoute).toContain('"@type": "NewsArticle"');
    expect(articleRoute).toContain("image: { ...articleImage");
    expect(articleRoute).toContain("thumbnailUrl: seo.image");
  });
});
