import { createFileRoute } from "@tanstack/react-router";
import { CityPage } from "@/components/city-page";
import { TEXAS_CITIES } from "@/data/texas-cities";
import { getArticlesByCategory } from "@/lib/category-feed.functions";
import { cityGuideHead } from "@/lib/city-seo";

const config = TEXAS_CITIES.houston;
const title = "Moving to Houston: City Guide, Tools & Local News | Keep TX Red";
const description =
  "Plan a move to Houston with guidance on communities, property taxes, schools, commutes, flood planning, vehicle registration, and current Houston-area coverage.";

export const Route = createFileRoute("/houston")({
  loader: () =>
    getArticlesByCategory({
      data: { region: config.region, limit: 12, order: "newest" },
    }),
  head: () => cityGuideHead(config, title, description),
  component: HoustonPage,
});

function HoustonPage() {
  return <CityPage config={config} liveArticles={Route.useLoaderData()} />;
}
