import { createFileRoute, notFound } from "@tanstack/react-router";
import { TexasBusinessView, BUSINESS_SECTIONS, BUSINESS_TOPIC_SLUGS } from "@/components/texas-business-view";

const VALID = new Set(BUSINESS_TOPIC_SLUGS);

export const Route = createFileRoute("/texas-business/$topic")({
  beforeLoad: ({ params }) => {
    if (!VALID.has(params.topic)) throw notFound();
  },
  head: ({ params }) => {
    const section = BUSINESS_SECTIONS.find((s) => s.id === params.topic);
    if (!section) {
      return {
        meta: [
          { title: "Topic not found — Texas Business" },
          { name: "robots", content: "noindex,follow" },
        ],
      };
    }
    const title = section ? `${section.title} — Texas Business` : "Texas Business";
    const desc = section?.description ?? "Texas business coverage.";
    const canonical = "https://www.keeptxred.com/texas-business";
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
  return <TexasBusinessView topic={topic} />;
}