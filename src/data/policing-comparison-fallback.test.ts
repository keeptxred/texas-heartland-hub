import { describe, expect, it } from "vitest";
import { articleMainWordCount, meetsArticleMainWordCount } from "@/lib/article-length";
import { POLICING_COMPARISON_FALLBACK } from "./policing-comparison-fallback";

describe("policing comparison source fallback", () => {
  it("preserves a substantive renderable copy of the production article", () => {
    expect(POLICING_COMPARISON_FALLBACK.slug).toBe("texas-policing-agencies-compared");
    expect(POLICING_COMPARISON_FALLBACK.image_url).toBe(
      "/images/news/texas-policing-agencies-compared.jpg",
    );
    expect(POLICING_COMPARISON_FALLBACK.body.sections).toHaveLength(16);
    expect(POLICING_COMPARISON_FALLBACK.body.sources.length).toBeGreaterThanOrEqual(10);
    expect(articleMainWordCount(POLICING_COMPARISON_FALLBACK.body)).toBeGreaterThanOrEqual(3000);
    expect(
      meetsArticleMainWordCount(POLICING_COMPARISON_FALLBACK.kind, POLICING_COMPARISON_FALLBACK.body),
    ).toBe(true);
  });
});
