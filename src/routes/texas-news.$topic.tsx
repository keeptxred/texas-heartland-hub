import { createFileRoute, notFound } from "@tanstack/react-router";
import { TexasNewsView, TEXAS_NEWS_SECTIONS } from "@/components/texas-news-view";
import { getLiveArticlesByCategory } from "@/lib/articles-by-category.functions";

const VALID = new Set(TEXAS_NEWS_SECTIONS.map((s) => s.id));

export const Route = createFileRoute("/texas-news/$topic")({
  beforeLoad: ({ params }) => {
    if (!VALID.has(params.topic)) throw notFound();
  },
  loader: ({ params }) => getLiveArticlesByCategory({ data: { activeFilter: params.topic } }),
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