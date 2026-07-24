import { createFileRoute } from "@tanstack/react-router";
import { CityPage } from "@/components/city-page";
import { TEXAS_CITIES } from "@/data/texas-cities";
import { getArticlesByCategory } from "@/lib/category-feed.functions";
import { cityGuideHead } from "@/lib/city-seo";

const config = TEXAS_CITIES.austin;
const title = "Moving to Austin: City Guide, Tools & Local News | Keep TX Red";
const description =
  "Plan a move to Austin with practical guidance on housing costs, technology jobs, commutes, property taxes, schools, utilities, and current Austin-area coverage.";

export const Route = createFileRoute("/austin")({
  loader: () =>
    getArticlesByCategory({
      data: { region: config.region, limit: 12, order: "newest" },
    }),
  head: () => cityGuideHead(config, title, description),
  component: AustinPage,
});

function AustinPage() {
  return <CityPage config={config} liveArticles={Route.useLoaderData()} />;
}
