import { createFileRoute, notFound } from "@tanstack/react-router";
import { TexasNewsView, TEXAS_NEWS_SECTIONS } from "@/components/texas-news-view";
import { CATEGORY_SLUG_TO_NAME, isCategorySlug } from "@/lib/articles-by-category";
import { getArticlesByCategory } from "@/lib/category-feed.functions";

const VALID = new Set(TEXAS_NEWS_SECTIONS.map((s) => s.id));
const SPORTS_CULTURE_KINDS = [
  "sports-nfl",
  "sports-mlb",
  "sports-nba",
  "sports-cfb",
] as const;

export const Route = createFileRoute("/texas-news/$topic")({
  beforeLoad: ({ params }) => {
    if (!VALID.has(params.topic)) throw notFound();
  },
  loader: ({ params }) => {
    if (params.topic === "sports-culture") {
      return getArticlesByCategory({
        data: {
          kind: [...SPORTS_CULTURE_KINDS],
          limit: 24,
          order: "newest",
        },
      });
    }
    if (!isCategorySlug(params.topic)) return [];
    return getArticlesByCategory({
      data: {
        category: CATEGORY_SLUG_TO_NAME[params.topic],
        limit: 24,
        order: "newest",
      },
    });
  },
  head: ({ params }) => {
    const section = TEXAS_NEWS_SECTIONS.find((s) => s.id === params.topic);
    if (!section) {
      return {
        meta: [
          { title: "Topic not found — Texas News" },
          { name: "robots", content: "noindex,follow" },
        ],
      };
    }
    const title = section ? `${section.title} — Texas News` : "Texas News";
    const desc = section?.description ?? "Texas news coverage.";
    // Filter sub-routes consolidate into the main category page — canonical to
    // the base URL + noindex prevents duplicate indexed pages.
    const canonical = "https://www.keeptxred.com/texas-news";
    return {
      meta: [
        { title: `${title} | Keep Texas Red` },
        { name: "description", content: desc },
        { name: "robots", content: "noindex,follow" },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: canonical },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: canonical }],
    };
  },
  component: TopicPage,
});

function TopicPage() {
  const { topic } = Route.useParams();
  const liveArticles = Route.useLoaderData();
  return <TexasNewsView topic={topic} liveArticles={liveArticles} />;
}
