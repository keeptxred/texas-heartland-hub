import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./news.$slug.tsx", import.meta.url), "utf8");

describe("news article SEO/AEO contract", () => {
  it("keeps canonical NewsArticle identity and publisher signals", () => {
    expect(source).toContain('"@type": "NewsArticle"');
    expect(source).toContain("mainEntityOfPage");
    expect(source).toContain("datePublished");
    expect(source).toContain("dateModified");
    expect(source).toContain("publisher: { \"@id\": ORGANIZATION_ID }");
    expect(source).toContain("personJsonLd");
  });

  it("keeps breadcrumb, FAQ, and entity schema attached to articles", () => {
    expect(source).toContain('"@type": "BreadcrumbList"');
    expect(source).toContain('"@type": "FAQPage"');
    expect(source).toContain("about: body.entities");
  });

  it("propagates cloud noindex flags into page robots metadata", () => {
    expect(source).toContain("getCloudArticleIndexability");
    expect(source).toContain("noindex: article.noindex === true");
  });

  it("keeps visible evidence and answer-oriented article fields", () => {
    expect(source).toContain(">Sources</h2>");
    expect(source).not.toContain("Official Sources");
    expect(source).toContain("body.sources.map");
    expect(source).toContain("body.keyTakeaways");
    expect(source).toContain("body.intro.map");
  });
});
