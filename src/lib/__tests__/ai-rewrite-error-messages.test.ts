import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("AI rewrite error message taxonomy", () => {
  it("keeps KTR, Gemini quota, and Gemini configuration failures distinct", () => {
    const file = fs.readFileSync(
      path.resolve(process.cwd(), "src/services/publishArticle.functions.ts"),
      "utf8",
    );

    expect(file).toContain("KTR automated rewrite limit reached");
    expect(file).toContain("Google Gemini quota/rate limit reached");
    expect(file).toContain("Direct Google Gemini is not configured");
    expect(file).toContain("Lovable AI credits are not being used");
    expect(file).toContain("not a Lovable credit limit");
  });
});
