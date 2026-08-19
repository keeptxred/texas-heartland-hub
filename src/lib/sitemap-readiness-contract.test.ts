import fs from "node:fs";
import { describe, expect, it } from "vitest";

const evergreen = fs.readFileSync(new URL("./evergreen.functions.ts", import.meta.url), "utf8");

describe("cloud sitemap readiness contract", () => {
  it("uses the same public-readiness predicate as homepage and robots", () => {
    expect(evergreen).toContain('import { isPublicArticleReady } from "@/lib/public-article-readiness"');
    expect(evergreen).toContain("if (!isPublicArticleReady(a)) return false");
    expect(evergreen).toContain("category,source_name,source_url,published_at");
    expect(evergreen).toContain("content_quality_score");
  });
});
