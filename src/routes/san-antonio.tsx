import { createFileRoute } from "@tanstack/react-router";
import { CityPage } from "@/components/city-page";
import { TEXAS_CITIES } from "@/data/texas-cities";
import { getArticlesByCategory } from "@/lib/category-feed.functions";
import { cityGuideHead } from "@/lib/city-seo";

const config = TEXAS_CITIES["san-antonio"];
const title = "Moving to San Antonio: City Guide, Tools & Local News | Keep TX Red";
const description =
  "Plan a move to San Antonio with guidance on neighborhoods, regional growth, military and health-care jobs, taxes, schools, utilities, and current local coverage.";

export const Route = createFileRoute("/san-antonio")({
  loader: () =>
    getArticlesByCategory({
      data: { region: config.region, limit: 12, order: "newest" },
    }),
  head: () => cityGuideHead(config, title, description),
  component: SanAntonioPage,
});

function SanAntonioPage() {
  return <CityPage config={config} liveArticles={Route.useLoaderData()} />;
}
