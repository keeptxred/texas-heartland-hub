import { createFileRoute } from "@tanstack/react-router";
import { TexasNewsView } from "@/components/texas-news-view";

export const Route = createFileRoute("/texas-news")({
  head: () => ({
    meta: [
      { title: "Texas News & Insights (Culture, Economy, Lifestyle Updates)" },
      { name: "description", content: "Ongoing coverage of Texas culture, economy, housing, jobs, and lifestyle trends. Not breaking news—focused on long-term insights." },
      { property: "og:title", content: "Texas News & Insights (Culture, Economy, Lifestyle Updates)" },
      { property: "og:description", content: "Ongoing coverage of Texas culture, economy, housing, jobs, and lifestyle trends." },
      { property: "og:url", content: "https://www.keeptxred.com/texas-news" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://www.keeptxred.com/texas-news" }],
  }),
  component: () => <TexasNewsView topic="" />,
});