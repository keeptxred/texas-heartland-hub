import { describe, expect, it } from "vitest";
import { assessAdminArticleImage } from "./admin-article-image-readiness";

describe("assessAdminArticleImage", () => {
  it("treats a failed generation status as needing a retry even when a URL exists", () => {
    expect(assessAdminArticleImage("https://example.com/old.jpg", "failed")).toEqual({
      failed: true,
      legacyPlaceholder: false,
      needsImage: true,
    });
  });

  it("treats a validated nonlegacy URL as ready", () => {
    expect(assessAdminArticleImage("/api/public/article-image/story.jpg", "ready")).toEqual({
      failed: false,
      legacyPlaceholder: false,
      needsImage: false,
    });
  });

  it("blocks legacy generated placeholders regardless of status", () => {
    expect(assessAdminArticleImage("/images/news/generated/2026-09-01/story.jpg", "ready")).toEqual({
      failed: false,
      legacyPlaceholder: true,
      needsImage: true,
    });
  });

  it("requires an image when the URL is missing", () => {
    expect(assessAdminArticleImage(null, null).needsImage).toBe(true);
  });
});
