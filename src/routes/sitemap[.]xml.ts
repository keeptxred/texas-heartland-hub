import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import {
  BASE_URL,
  isRealImage,
  isArticleSlugDateConsistent,
  xmlEscape,
  xmlResponse,
} from "@/lib/sitemap-shared";
import { ARTICLES, isPublished } from "@/data/articles";
import { ARTICLE_BODIES } from "@/data/article-bodies";
import { listSitemapArticles } from "@/lib/evergreen.functions";
import { getProducts } from "@/lib/products.functions";
import { AUTHORS, authorSlug } from "@/data/authors";
import { getPublishedAuthorArticles } from "@/lib/daily-news.functions";
import { ELECTION_STATIC_SITEMAP_COUNT } from "@/lib/elections/sitemap";
import { GOVERNMENT_ENTITIES } from "@/lib/texas-government";
import { TEXAS_POLITICAL_FIGURES } from "@/data/texas-political-figures";
import { isStaticArticleIndexable } from "@/lib/static-article-indexability";
import { hasEnoughAuthorArticles, isCompleteAuthorProfile } from "@/lib/author-indexability";

/** Sitemap index. Includes every dedicated sitemap at most once and omits empty dynamic sitemaps. */
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const cutoff = Date.now() - 48 * 60 * 60 * 1000;
        const localArticles = ARTICLES.filter((article) =>
          isPublished(article)
          && isStaticArticleIndexable(article)
          && Boolean(ARTICLE_BODIES[article.slug])
          && isArticleSlugDateConsistent(article.slug, article.publishedAt),
        );
        let cloudArticles: Array<{
          published_at: string;
          image_url: string | null;
          title: string;
          slug: string;
          kind: string;
          updated_at: string | null;
        }> = [];
        try {
          cloudArticles = (await listSitemapArticles()).articles.filter((article) =>
            isArticleSlugDateConsistent(article.slug, article.published_at),
          );
        } catch (error) {
          console.error("sitemap index: cloud articles fetch failed", error);
        }

        const newsCount =
          localArticles.filter((article) => new Date(article.publishedAt).getTime() >= cutoff).length
          + cloudArticles.filter((article) =>
            new Date(article.published_at).getTime() >= cutoff
            && (article.kind === "ingested" || article.kind === "news"),
          ).length;
        const evergreenCount = localArticles.length + cloudArticles.length;

        let productCount = 0;
        let productImageCount = 0;
        try {
          const { products, isFallback } = await getProducts();
          if (!isFallback) {
            const completeProducts = products.filter((product) =>
              String(product.id ?? "").trim()
              && String(product.title ?? "").trim()
              && isRealImage(product.image),
            );
            productCount = completeProducts.length;
            productImageCount = completeProducts.length;
          }
        } catch (error) {
          console.error("sitemap index: products fetch failed", error);
        }

        const authorArticleSlugs = new Map<string, Set<string>>();
        const addAuthorArticle = (authorName: string, slug: string) => {
          const slugKey = authorSlug(authorName);
          if (!slugKey || !slug) return;
          const slugs = authorArticleSlugs.get(slugKey) ?? new Set<string>();
          slugs.add(slug);
          authorArticleSlugs.set(slugKey, slugs);
        };
        for (const article of localArticles) addAuthorArticle(article.author, article.slug);
        try {
          const { articles: liveArticles } = await getPublishedAuthorArticles();
          for (const article of liveArticles) {
            if (article.slug && article.author) addAuthorArticle(article.author, article.slug);
          }
        } catch (error) {
          console.error("sitemap index: live author bylines fetch failed", error);
        }
        const authorCount = AUTHORS.filter((author) =>
          isCompleteAuthorProfile(author)
          && hasEnoughAuthorArticles(authorArticleSlugs.get(author.slug) ?? []),
        ).length;

        const imageCount =
          localArticles.filter((article) => isRealImage(article.image)).length
          + cloudArticles.filter((article) => isRealImage(article.image_url)).length
          + productImageCount;

        const candidates = [
          { file: "sitemap-pages.xml", count: 1 },
          { file: "sitemap-sources.xml", count: 1 },
          { file: "sitemap-news.xml", count: newsCount },
          { file: "sitemap-evergreen.xml", count: evergreenCount },
          { file: "sitemap-elections.xml", count: ELECTION_STATIC_SITEMAP_COUNT },
          // Bulk district and representative detail sitemaps are intentionally not
          // advertised in the sitemap index. Search Console showed hundreds of these
          // programmatic URLs sitting in "Discovered - currently not indexed" while
          // higher-value newsroom and hub pages competed for the same crawl attention.
          // Their routes remain live and internally discoverable; they can be promoted
          // back into the index once they meet stronger unique-content thresholds.
          { file: "sitemap-government.xml", count: GOVERNMENT_ENTITIES.length + 1 },
          { file: "sitemap-political-figures.xml", count: TEXAS_POLITICAL_FIGURES.length + 1 },
          { file: "sitemap-legislature.xml", count: 1 },
          { file: "sitemap-committees.xml", count: 1 },
          // The dedicated bill endpoint remains valid because it was historically
          // submitted directly in Search Console, but do not advertise it from the
          // index while /bills itself is still waiting to be indexed. This prevents
          // a second discovery path from flooding Google with database-detail URLs.
          { file: "sitemap-authors.xml", count: authorCount },
          { file: "sitemap-products.xml", count: productCount },
          { file: "sitemap-images.xml", count: imageCount },
        ];

        const seen = new Set<string>();
        const included = candidates.filter(({ file, count }) => {
          if (count <= 0 || seen.has(file)) return false;
          seen.add(file);
          return true;
        });
        const entries = included.map(({ file }) =>
          `  <sitemap>\n    <loc>${xmlEscape(`${BASE_URL}/${file}`)}</loc>\n  </sitemap>`,
        ).join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</sitemapindex>`;
        return xmlResponse(xml);
      },
    },
  },
});