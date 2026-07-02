import { createFileRoute } from "@tanstack/react-router";
import { TexasNewsView } from "@/components/texas-news-view";

export const Route = createFileRoute("/texas-news")({
  head: () => ({
    meta: [
      { title: "Texas News – Breaking News & Statewide Updates" },
      { name: "description", content: "Breaking Texas news and statewide updates on politics, the economy, energy, education, and the stories shaping life in the Lone Star State." },
      { property: "og:title", content: "Texas News – Breaking News & Statewide Updates" },
      { property: "og:description", content: "Breaking Texas news and statewide updates from across the Lone Star State." },
      { property: "og:url", content: "https://www.keeptxred.com/texas-news" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://www.keeptxred.com/texas-news" }],
  }),
  component: () => <TexasNewsView topic="" />,
});