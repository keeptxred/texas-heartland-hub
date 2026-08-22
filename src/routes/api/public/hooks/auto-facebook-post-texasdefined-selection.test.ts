import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("./auto-facebook-post-texasdefined.ts", import.meta.url), "utf8");

describe("TexasDefined Facebook article selection", () => {
  it("keeps a long article URL cooldown", () => {
    expect(source).toContain("const ARTICLE_HISTORY_DAYS = 45");
    expect(source).toContain(".limit(250)");
  });

  it("prioritizes list and gateway traffic drivers", () => {
    for (const term of ["things", "best", "before", "reasons", "facts", "road-trip", "guide", "places", "visit"]) {
      expect(source).toContain(`\"${term}\"`);
    }
    expect(source).toContain("candidateTrafficScore(b) - candidateTrafficScore(a)");
    expect(source).toContain("metadataTrafficScore(candidate, metadata)");
  });

  it("still enforces live Facebook duplicate and posting guards", () => {
    expect(source).toContain("fetchRecentFacebookPagePosts");
    expect(source).toContain("facebookPostMatchesArticle");
    expect(source).toContain("hardPostingGuard");
    expect(source).toContain("MAX_DAILY_POSTS = 2");
    expect(source).toContain("MIN_GAP_MINUTES = 180");
  });
});
