import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { TexasBusinessView } from "@/components/texas-business-view";

const searchSchema = z.object({
  topic: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/texas-business")({
  validateSearch: zodValidator(searchSchema),
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