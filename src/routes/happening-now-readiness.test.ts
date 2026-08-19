import fs from "node:fs";
import { describe, expect, it } from "vitest";

const source = fs.readFileSync(new URL("./happening-now.tsx", import.meta.url), "utf8");

describe("Happening Now article-link readiness", () => {
  it("loads the fields required by the shared public readiness gate", () => {
    expect(source).toContain('import { isPublicArticleReady, type PublicArticleCandidate } from "@/lib/public-article-readiness"');
    expect(source).toContain('import { meetsArticleMainWordCount } from "@/lib/article-length"');
    expect(source).toContain('select("slug,kind,category,source_name,source_url,published_at,content_quality_score,body_json,quality_flags")');
  });

  it("only treats discovery-ready articles as native Keep TX Red destinations", () => {
    expect(source).toContain("isPublicArticleReady(article)");
    expect(source).toContain("meetsArticleMainWordCount(article.kind, article.body_json as never)");
    expect(source).toContain("link: hasNativeArticle ? `/news/${row.internal_slug}` : row.link");
  });
});
