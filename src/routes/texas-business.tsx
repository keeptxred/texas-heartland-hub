import { createFileRoute } from "@tanstack/react-router";
import { TexasBusinessView } from "@/components/texas-business-view";

export const Route = createFileRoute("/texas-business")({
  validateSearch: (search: Record<string, unknown>) => ({
    topic: typeof search.topic === "string" ? search.topic : "",
  }),
  head: ({ match }) => {
    const topic = (match.search as { topic?: string } | undefined)?.topic ?? "";
    const canonical = "https://www.keeptxred.com/texas-business";
    return {
      meta: [
        { title: "Texas Business News – Economy, Jobs & Growth Updates" },
        { name: "description", content: "Texas business news on the state economy, jobs, energy, corporate relocations, and the policy decisions shaping growth across Houston, Dallas, Austin, and San Antonio." },
        { property: "og:title", content: "Texas Business News – Economy, Jobs & Growth Updates" },
        { property: "og:description", content: "Texas business news on the state economy, jobs, energy, and corporate growth." },
        { property: "og:url", content: canonical },
        { property: "og:type", content: "website" },
        ...(topic ? [{ name: "robots", content: "noindex,follow" }] : []),
      ],
      links: [{ rel: "canonical", href: canonical }],
    };
  },
  component: BusinessPage,
});

function BusinessPage() {
  const { topic } = Route.useSearch();
  return <TexasBusinessView topic={topic ?? ""} />;
}