import { createFileRoute } from "@tanstack/react-router";
import { TexasNewsView } from "@/components/texas-news-view";
import { getArticlesByCategory } from "@/lib/category-feed.functions";

export const Route = createFileRoute("/texas-news/")({
  head: ({ match }) => {
    const topic = (match.search as { topic?: string } | undefined)?.topic ?? "";
    const canonical = "https://keeptxred.com/texas-news";
    return {
      meta: [
        { title: "Texas News & Insights (Culture, Economy, Lifestyle Updates)" },
        {
          name: "description",
          content:
            "Ongoing coverage of Texas culture, economy, housing, jobs, and lifestyle trends. Not breaking news—focused on long-term insights.",
        },
        {
          property: "og:title",
          content: "Texas News & Insights (Culture, Economy, Lifestyle Updates)",
        },
        {
          property: "og:description",
          content:
            "Ongoing coverage of Texas culture, economy, housing, jobs, and lifestyle trends.",
        },
        { property: "og:url", content: canonical },
        { property: "og:type", content: "website" },
        ...(topic ? [{ name: "robots", content: "noindex,follow" }] : []),
      ],
      links: [{ rel: "canonical", href: canonical }],
    };
  },
  loader: () =>
    getArticlesByCategory({
      data: {
        limit: 60,
        offset: 0,
        order: "newest",
      },
    }),
  component: NewsIndexPage,
});

function NewsIndexPage() {
  const liveArticles = Route.useLoaderData();
  return <TexasNewsView topic="" liveArticles={liveArticles} />;
}
