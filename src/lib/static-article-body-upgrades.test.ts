import { describe, expect, it } from "vitest";
import { ARTICLE_BODIES } from "@/data/article-bodies";
import {
  dedupeArticleBody,
  isOfficialArticleSource,
  type ArticleBodyShape,
} from "@/lib/article-dedupe";
import { applyStaticArticleBodyUpgrade } from "@/lib/static-article-body-upgrades";

function renderedHomesteadBody() {
  const legacy = ARTICLE_BODIES["homestead-exemption-explained"];
  expect(legacy).toBeTruthy();
  return dedupeArticleBody(legacy);
}

function visibleWordCount(body: ArticleBodyShape): number {
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

describe("static article body authority upgrades", () => {
  it("upgrades the legacy homestead explainer into a substantive current guide", () => {
    const body = renderedHomesteadBody();
    expect(body.updated).toBe("2026-08-16");
    expect(visibleWordCount(body)).toBeGreaterThanOrEqual(1400);
    expect(body.sections?.length).toBeGreaterThanOrEqual(9);
    expect(body.faq?.length).toBeGreaterThanOrEqual(8);
  });

  it("corrects mid-year purchase eligibility instead of telling buyers to wait until next year", () => {
    const body = renderedHomesteadBody();
    const text = JSON.stringify(body);
    expect(text).toContain("applicable portion of that same tax year");
    expect(text).toContain("previous owner did not receive the same exemption");
    expect(text).not.toContain("full exemption starting January 1 of the following year");
  });

  it("anchors late filing to tax delinquency rather than two years after April 30", () => {
    const body = renderedHomesteadBody();
    const text = JSON.stringify(body);
    expect(text).toContain("two years after the taxes on the property become delinquent");
    expect(text).not.toContain("up to two years past the standard April 30 deadline");
  });

  it("states the appraisal-cap timing and new-improvement rule", () => {
    const body = renderedHomesteadBody();
    const text = JSON.stringify(body);
    expect(text).toContain("January 1 of the tax year following the year");
    expect(text).toContain("new improvements");
  });

  it("uses only official Texas sources in the rendered source list", () => {
    const body = renderedHomesteadBody();
    expect(body.sources?.length).toBeGreaterThanOrEqual(6);
    for (const source of body.sources ?? []) {
      expect(isOfficialArticleSource(source), source.url).toBe(true);
    }
  });

  it("links the high-impression page into the stronger property-tax authority cluster", () => {
    const body = renderedHomesteadBody() as ArticleBodyShape & { related?: string[]; cta?: { href?: string } };
    const text = JSON.stringify(body);
    expect(text).toContain("/texas/property-taxes-2026");
    expect(text).toContain("/news/texas-property-tax-laws-explained");
    expect(text).toContain("/news/appraisal-protest-playbook");
    expect(body.related).toEqual(expect.arrayContaining([
      "texas-property-tax-guide",
      "texas-property-tax-laws-explained",
      "appraisal-protest-playbook",
      "county-appraisal-districts-explained",
    ]));
    expect(body.cta?.href).toBe("/texas/property-taxes-2026");
  });

  it("leaves unrelated article bodies untouched", () => {
    const other = {
      updated: "2026-08-01",
      editorNote: "Different article",
      intro: ["Unrelated body."],
    };
    expect(applyStaticArticleBodyUpgrade(other)).toBe(other);
  });
});
