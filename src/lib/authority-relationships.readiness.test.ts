import fs from "node:fs";
import { describe, expect, it } from "vitest";

const source = fs.readFileSync(new URL("./authority-relationships.ts", import.meta.url), "utf8");

describe("authority related article readiness", () => {
  it("loads the fields required by the public readiness predicate", () => {
    expect(source).toContain("isPublicArticleReady");
    expect(source).toContain("category,source_name,source_url,published_at,content_quality_score,body_json,quality_flags");
  });

  it("drops unavailable or not-ready article relationships instead of synthesizing links", () => {
    expect(source).not.toContain("article: '/news/'");
    expect(source).toContain("if (!articleMap.has(row.target_key)) return []");
    expect(source).toContain("return rows.flatMap");
  });
});
