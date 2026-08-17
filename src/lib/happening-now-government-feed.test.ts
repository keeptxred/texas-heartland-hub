import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("../routes/happening-now.tsx", import.meta.url), "utf8");

describe("Happening Now government feed contract", () => {
  it("bases the dashboard on official feed rows rather than unrelated newsroom articles", () => {
    expect(source).toContain('.select("id,title,source,link,internal_slug,description,pub_date")');
    expect(source).toContain("if (!officialSource) return [];");
    expect(source).not.toContain('shouldDisplayBreakingSports(article.kind, article.published_at, "happening-now")');
    expect(source).not.toContain('.select("id,slug,title,category,dek,published_at,kind")');
  });

  it("preserves and exposes the official source URL", () => {
    expect(source).toContain("isOfficialGovernmentSource(row.source, row.link)");
    expect(source).toContain("sourceUrl: row.link");
    expect(source).toContain('link: hasNativeArticle ? `/news/${row.internal_slug}` : row.link');
    expect(source).toContain("Official source: {item.source}");
    expect(source).toContain("View official source ↗");
  });

  it("uses official rows when selecting the 24-hour versus seven-day window", () => {
    expect(source).toContain("item.officialSource &&");
    expect(source).toContain("return hasPrimaryItems ? PRIMARY_WINDOW_MS : FALLBACK_WINDOW_MS;");
  });
});
