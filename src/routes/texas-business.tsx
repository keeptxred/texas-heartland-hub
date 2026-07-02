import { createFileRoute } from "@tanstack/react-router";
import { TexasBusinessView } from "@/components/texas-business-view";

export const Route = createFileRoute("/texas-business")({
  head: () => ({
    meta: [
      { title: "Texas Business News – Economy, Jobs & Growth Updates" },
      { name: "description", content: "Texas business news on the state economy, jobs, energy, corporate relocations, and the policy decisions shaping growth across Houston, Dallas, Austin, and San Antonio." },
      { property: "og:title", content: "Texas Business News – Economy, Jobs & Growth Updates" },
      { property: "og:description", content: "Texas business news on the state economy, jobs, energy, and corporate growth." },
      { property: "og:url", content: "https://www.keeptxred.com/texas-business" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://www.keeptxred.com/texas-business" }],
  }),
  component: () => <TexasBusinessView topic="" />,
});
