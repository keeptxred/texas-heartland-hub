import { createFileRoute } from "@tanstack/react-router";
import { CityPage } from "@/components/city-page";
import { TEXAS_CITIES } from "@/data/texas-cities";
import { getArticlesByCategory } from "@/lib/category-feed.functions";
import { cityGuideHead } from "@/lib/city-seo";

const config = TEXAS_CITIES.dfw;
const title = "Moving to Dallas–Fort Worth | Keep TX Red";
const description =
  "Compare Dallas, Fort Worth, and major North Texas communities with practical guidance on jobs, commutes, property taxes, schools, and moving requirements.";

export const Route = createFileRoute("/dallas-fort-worth")({
  loader: () =>
    getArticlesByCategory({
      data: { region: config.region, limit: 12, order: "newest" },
    }),
  head: () => cityGuideHead(config, title, description),
  component: DallasFortWorthPage,
});

function DallasFortWorthPage() {
  return <CityPage config={config} liveArticles={Route.useLoaderData()} />;
}
