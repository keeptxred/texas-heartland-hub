import { createFileRoute } from "@tanstack/react-router";
import { CityPage } from "@/components/city-page";
import { TEXAS_CITIES } from "@/data/texas-cities";
import { getArticlesByCategory } from "@/lib/category-feed.functions";
import { cityGuideHead } from "@/lib/city-seo";

const config = TEXAS_CITIES["el-paso"];
const title = "Moving to El Paso: City Guide, Tools & Local News | Keep TX Red";
const description =
  "Plan a move to El Paso with guidance on the border economy, Fort Bliss, housing, property taxes, emissions testing, utilities, schools, and current local coverage.";

export const Route = createFileRoute("/el-paso")({
  loader: () =>
    getArticlesByCategory({
      data: { region: config.region, limit: 12, order: "newest" },
    }),
  head: () => cityGuideHead(config, title, description),
  component: ElPasoPage,
});

function ElPasoPage() {
  return <CityPage config={config} liveArticles={Route.useLoaderData()} />;
}
