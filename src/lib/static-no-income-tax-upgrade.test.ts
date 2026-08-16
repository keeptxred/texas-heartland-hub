import { describe, expect, it } from "vitest";
import { ARTICLE_BODIES } from "@/data/article-bodies";
import {
  dedupeArticleBody,
  isOfficialArticleSource,
  type ArticleBodyShape,
} from "@/lib/article-dedupe";
import { applyNoIncomeTaxArticleUpgrade } from "@/lib/static-no-income-tax-upgrade";

type RichBody = ArticleBodyShape & {
  editorNote?: string;
  related?: string[];
  cta?: { label?: string; href?: string };
};

function renderedBody(): RichBody {
  const legacy = ARTICLE_BODIES["why-texas-has-no-income-tax"];
  expect(legacy, "missing no-income-tax static fixture").toBeTruthy();
  return dedupeArticleBody(legacy) as RichBody;
}

function visibleWords(body: ArticleBodyShape): number {
  const values: string[] = [];
  if (Array.isArray(body.keyTakeaways)) values.push(...body.keyTakeaways);
  if (Array.isArray(body.intro)) values.push(...body.intro);
  for (const section of body.sections ?? []) {
    if (section.heading) values.push(section.heading);
    if (Array.isArray(section.paragraphs)) values.push(...section.paragraphs);
    if (Array.isArray(section.bullets)) values.push(...section.bullets);
  }
  for (const faq of body.faq ?? []) {
    if (faq.q) values.push(faq.q);
    if (faq.a) values.push(faq.a);
  }
  return values.join(" ").split(/\s+/).filter(Boolean).length;
}

describe("Texas no-income-tax static authority upgrade", () => {
  it("turns the short legacy explainer into a substantive current guide", () => {
    const body = renderedBody();
    expect(body.updated).toBe("2026-08-16");
    expect(visibleWords(body)).toBeGreaterThanOrEqual(1400);
    expect(body.sections?.length).toBeGreaterThanOrEqual(9);
    expect(body.faq?.length).toBeGreaterThanOrEqual(8);
  });

  it("separates state revenue from locally levied property tax", () => {
    const text = JSON.stringify(renderedBody());
    expect(text).toContain("Texas has no state property tax");
    expect(text).toContain("Local taxing units");
    expect(text).toContain("58% of state tax collections");
    expect(text).not.toContain("Share of State+Local Revenue");
  });

  it("uses the 2026 franchise-tax threshold rather than the stale 2024-25 threshold", () => {
    const text = JSON.stringify(renderedBody());
    expect(text).toContain("$2.65 million");
    expect(text).toContain("0.375%");
    expect(text).toContain("0.75%");
    expect(text).not.toContain("$2.47M");
  });

  it("states current sales and severance tax rates with the correct government level", () => {
    const text = JSON.stringify(renderedBody());
    expect(text).toContain("6.25%");
    expect(text).toContain("8.25%");
    expect(text).toContain("4.6%");
    expect(text).toContain("7.5%");
  });

  it("removes unsupported causal language from the legacy copy", () => {
    const text = JSON.stringify(renderedBody());
    expect(text).not.toContain("single biggest reason Texas led the nation");
    expect(text).not.toContain("The Trade-Off: High Property Taxes");
  });

  it("links the explainer into KTR's property-tax authority cluster", () => {
    const body = renderedBody();
    const text = JSON.stringify(body);
    expect(text).toContain("/texas/property-taxes-2026");
    expect(text).toContain("/news/texas-property-tax-laws-explained");
    expect(body.related).toEqual(expect.arrayContaining([
      "texas-property-tax-guide",
      "texas-property-tax-laws-explained",
      "homestead-exemption-explained",
    ]));
  });

  it("keeps the rendered source list limited to official government sources", () => {
    const body = renderedBody();
    expect(body.sources?.length).toBeGreaterThanOrEqual(8);
    for (const source of body.sources ?? []) {
      expect(isOfficialArticleSource(source), source.url).toBe(true);
    }
  });

  it("does not alter unrelated article bodies", () => {
    const other = {
      updated: "2026-08-16",
      intro: ["Unrelated article."],
      sections: [{ heading: "Another topic" }],
      faq: [{ q: "Different question?", a: "Different answer." }],
    };
    expect(applyNoIncomeTaxArticleUpgrade(other)).toBe(other);
  });
});
