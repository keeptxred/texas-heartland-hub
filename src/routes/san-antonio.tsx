import { createFileRoute } from "@tanstack/react-router";
import { CityPage } from "@/components/city-page";
import { TEXAS_CITIES } from "@/data/texas-cities";
import { getArticlesByCategory } from "@/lib/category-feed.functions";

const config = TEXAS_CITIES["san-antonio"];

export const Route = createFileRoute("/san-antonio")({
  loader: () =>
    getArticlesByCategory({
      data: { region: config.region, limit: 12, order: "newest" },
    }),
  head: () => ({
    meta: [
      { title: "Moving to San Antonio: City Guide, Tools & Local News | Keep TX Red" },
      {
        name: "description",
        content:
          "Plan a move to San Antonio with guidance on neighborhoods, regional growth, military and health-care jobs, taxes, schools, utilities, and current local coverage.",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.keeptxred.com/san-antonio" }],
  }),
  component: SanAntonioPage,
});

function SanAntonioPage() {
  return <CityPage config={config} liveArticles={Route.useLoaderData()} />;
}
