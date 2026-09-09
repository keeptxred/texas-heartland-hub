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

  it("routes retired KeepTXRed aliases directly to canonical destinations before rendering", () => {
    const body = dedupeArticleBody({
      intro: [
        "Start with [Texas News](/texas-news) and [Election Central](/elections/?cycle=2026#top).",
      ],
      sections: [
        {
          heading: "Follow the Legislature",
          paragraphs: [
            "Use [Legislative Updates](/legislative-updates) and [Texas Law & Policy](https://www.keeptxred.com/texas-law-policy#guide), while keeping [Election Races](/elections/races) unchanged.",
          ],
          bullets: ["Read [Texas Laws](/texas-laws) before the next session."],
        },
      ],
      keyTakeaways: ["The [laws guide](/laws-to-know) is now consolidated."],
      faq: [
        {
          q: "Where is the [election hub](/elections)?",
          a: "Use [Election Central](/elections) for the current cycle.",
        },
      ],
      sources: [],
    });

    expect(body.intro?.[0]).toContain("[Texas News](/news)");
    expect(body.intro?.[0]).toContain("[Election Central](/elections/2026?cycle=2026#top)");
    expect(body.sections?.[0]?.paragraphs?.[0]).toContain("[Legislative Updates](/bills)");
    expect(body.sections?.[0]?.paragraphs?.[0]).toContain("https://keeptxred.com/laws#guide");
    expect(body.sections?.[0]?.paragraphs?.[0]).toContain("[Election Races](/elections/races)");
    expect(body.sections?.[0]?.bullets?.[0]).toContain("[Texas Laws](/laws)");
    expect(body.keyTakeaways?.[0]).toContain("[laws guide](/laws)");
    expect(body.faq?.[0]?.q).toContain("[election hub](/elections/2026)");
    expect(body.faq?.[0]?.a).toContain("[Election Central](/elections/2026)");
  });
});
