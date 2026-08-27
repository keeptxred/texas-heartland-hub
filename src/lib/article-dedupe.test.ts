import { describe, expect, it } from "vitest";
import { dedupeArticleBody, isOfficialArticleSource } from "./article-dedupe";

describe("article source authority", () => {
  it("accepts government and military sources as official", () => {
    expect(isOfficialArticleSource({ label: "Texas Legislature Online", url: "https://capitol.texas.gov/" })).toBe(true);
    expect(isOfficialArticleSource({ label: "Texas Secretary of State", url: "https://www.sos.state.tx.us/" })).toBe(true);
    expect(isOfficialArticleSource({ label: "Department of Defense", url: "https://www.defense.gov/" })).toBe(true);
    expect(isOfficialArticleSource({ label: "Air Force", url: "https://www.af.mil/" })).toBe(true);
  });

  it("rejects Reddit and other community/social sources from Official Sources", () => {
    expect(isOfficialArticleSource({ label: "r/texas", url: "https://www.reddit.com/r/texas/comments/example" })).toBe(false);
    expect(isOfficialArticleSource({ label: "X post", url: "https://x.com/example/status/1" })).toBe(false);
    expect(isOfficialArticleSource({ label: "Facebook post", url: "https://www.facebook.com/example/posts/1" })).toBe(false);
    expect(isOfficialArticleSource({ label: "YouTube", url: "https://www.youtube.com/watch?v=example" })).toBe(false);
  });

  it("rejects news outlets and malformed URLs from Official Sources", () => {
    expect(isOfficialArticleSource({ label: "Local newspaper", url: "https://example.com/story" })).toBe(false);
    expect(isOfficialArticleSource({ label: "Bad URL", url: "not-a-url" })).toBe(false);
  });

  it("filters non-official sources before article rendering", () => {
    const body = dedupeArticleBody({
      intro: ["A sufficiently long article introduction for the regression test."],
      sections: [],
      faq: [],
      sources: [
        { label: "Texas Secretary of State", url: "https://www.sos.state.tx.us/elections/" },
        { label: "r/texas", url: "https://www.reddit.com/r/texas/comments/example" },
        { label: "News report", url: "https://example.com/report" },
      ],
    });

    expect(body.sources).toEqual([
      { label: "Texas Secretary of State", url: "https://www.sos.state.tx.us/elections/" },
    ]);
  });

  it("routes migrated calculator links directly to TexasDefined before rendering", () => {
    const body = dedupeArticleBody({
      intro: ["Use the [Texas Mortgage Calculator](/tools/mortgage-calculator?price=350000) before choosing a home."],
      sections: [
        {
          heading: "Compare costs",
          paragraphs: [
            "Estimate taxes with the [Texas Property Tax Calculator](/tools/property-tax-calculator#estimate), but keep the [Texas budget tool](/tools/texas-budget-headroom) on Keep TX Red.",
          ],
        },
      ],
      faq: [],
      sources: [],
    });

    expect(body.intro?.[0]).toContain("https://texasdefined.com/texas-mortgage-calculator?price=350000");
    expect(body.sections?.[0]?.paragraphs?.[0]).toContain("https://texasdefined.com/decide/property-taxes#estimate");
    expect(body.sections?.[0]?.paragraphs?.[0]).toContain("/tools/texas-budget-headroom");
  });
});
