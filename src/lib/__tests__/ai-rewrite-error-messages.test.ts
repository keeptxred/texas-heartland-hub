import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { classifyAiRewriteError } from "../ai-rewrite-error";

describe("AI rewrite error message taxonomy", () => {
  it("classifies quota and configuration failures separately", () => {
    expect(classifyAiRewriteError("Daily AI rewrite budget reached (25). Try again after midnight UTC.")).toBe("ktr_daily_cap");
    expect(classifyAiRewriteError("AI rewrite failed — AI gateway HTTP 429 during initial")).toBe("gemini_quota");
    expect(classifyAiRewriteError("AI rewrite failed — AI gateway HTTP 503 during initial")).toBe("gemini_unconfigured");
    expect(classifyAiRewriteError("AI rewrite failed — AI gateway HTTP 401 during initial")).toBe("gemini_auth");
    expect(classifyAiRewriteError("AI rewrite failed — AI gateway timed out during retry")).toBe("gemini_timeout");
  });

  it("keeps admin copy explicit about Lovable not being used", () => {
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
