import { createFileRoute, notFound } from "@tanstack/react-router";
import { TexasNewsView, TEXAS_NEWS_SECTIONS } from "@/components/texas-news-view";

const VALID = new Set(TEXAS_NEWS_SECTIONS.map((s) => s.id));

export const Route = createFileRoute("/texas-news/$topic")({
  beforeLoad: ({ params }) => {
    if (!VALID.has(params.topic)) throw notFound();
  },
  head: ({ params }) => {
    const section = TEXAS_NEWS_SECTIONS.find((s) => s.id === params.topic);
    const title = section ? `${section.title} — Texas News` : "Texas News";
    const desc = section?.description ?? "Texas news coverage.";
    const url = `https://www.keeptxred.com/texas-news/${params.topic}`;
    return {
      meta: [
        { title: `${title} | Keep Texas Red` },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: TopicPage,
});

function TopicPage() {
  const { topic } = Route.useParams();
  return <TexasNewsView topic={topic} />;
}