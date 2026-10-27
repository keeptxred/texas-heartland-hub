import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { hydrateApprovedBillArticleRows } from "@/lib/public-bill-relations";

describe("approved bill news relationships", () => {
  it("renders the source-verified HB 1056 article only from an approved joined relation", () => {
    const result = hydrateApprovedBillArticleRows([
      {
        review_status: "approved",
        relationship_type: "explainer",
        article_id: "article-1056",
        daily_articles: {
          id: "article-1056",
          slug: "texas-gold-silver-legal-tender-hb-1056",
          title: "Texas Gold and Silver Legal Tender Law Takes Effect Sept. 1",
          seo_headline: "Texas Gold and Silver Legal Tender Law: What HB 1056 Does Sept. 1",
          dek: "Reviewed source-backed explanation.",
        },
      },
      {
        review_status: "pending",
        relationship_type: "explainer",
        daily_articles: { id: "unapproved", slug: "unapproved", title: "Not reviewed" },
      },
      { review_status: "approved", relationship_type: "explainer", daily_articles: null },
    ]);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: "article-1056",
      slug: "texas-gold-silver-legal-tender-hb-1056",
      title: "Texas Gold and Silver Legal Tender Law: What HB 1056 Does Sept. 1",
      excerpt: "Reviewed source-backed explanation.",
      relationship_type: "explainer",
    });
  });

  it("uses a single approved-only foreign-key nested read instead of two independent lookups", () => {
    const source = readFileSync("src/lib/public-bill-relations.ts", "utf8");
    expect(source).toContain(".from('bill_article_relationships')");
    expect(source).toContain(".eq('review_status', 'approved')");
    expect(source).toContain("daily_articles(id,title,seo_headline,slug,dek,published_at,image_url)");
    expect(source).not.toContain(".from('daily_articles')");
    expect(source).toContain("for (let attempt = 0; attempt < 2; attempt += 1)");
    expect(source).toContain("articles: hydrateApprovedBillArticleRows(articleRelationshipRows)");
  });
});
