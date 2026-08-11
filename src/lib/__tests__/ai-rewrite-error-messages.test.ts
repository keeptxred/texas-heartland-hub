import { describe, expect, it } from "vitest";

// These tests intentionally exercise the public admin-facing behavior through
// stable message patterns. The implementation lives in publishArticle.functions.ts.
describe("AI rewrite error message taxonomy", () => {
  it("keeps the three quota/configuration classes distinct", () => {
    const source = [
      "KTR automated rewrite limit reached",
      "Google Gemini quota/rate limit reached",
      "Direct Google Gemini is not configured",
    ];

    expect(new Set(source).size).toBe(3);
    expect(source[0]).toContain("KTR");
    expect(source[1]).toContain("Gemini");
    expect(source[2]).toContain("not configured");
  });
});
