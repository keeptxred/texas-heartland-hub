import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./news-government-graph-router.tsx", import.meta.url), "utf8");

describe("news issue context routing", () => {
  it("routes article loader content through the deterministic issue matcher", () => {
    expect(source).toContain('import { matchArticleIssueGuides } from "@/lib/article-issue-guides"');
    expect(source).toContain("title: loaderData?.article?.title");
    expect(source).toContain("dek: loaderData?.article?.dek");
    expect(source).toContain("category: loaderData?.article?.category");
    expect(source).toContain("text,");
  });

  it("renders policy context independently of government graph availability", () => {
    expect(source).toContain("<ArticleIssueContext matches={issueMatches} />");
    expect(source).toContain("links.length === 0 && issueMatches.length === 0");
    expect(source).toContain("{links.length > 0 ? (");
  });
});
