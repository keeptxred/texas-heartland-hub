import { createFileRoute } from "@tanstack/react-router";
import { CityPage } from "@/components/city-page";
import { TEXAS_CITIES } from "@/data/texas-cities";
import { getArticlesByCategory } from "@/lib/category-feed.functions";

const config = TEXAS_CITIES.dfw;

export const Route = createFileRoute("/dallas-fort-worth")({
  loader: () =>
    getArticlesByCategory({
      data: { region: config.region, limit: 12, order: "newest" },
    }),
  head: () => ({
    meta: [
      { title: "Moving to Dallas–Fort Worth: DFW City Guide & Local News | Keep TX Red" },
      {
        name: "description",
        content:
          "Compare Dallas, Fort Worth, and major North Texas communities with practical guidance on jobs, commutes, property taxes, schools, and moving requirements.",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.keeptxred.com/dallas-fort-worth" }],
  }),
  component: DallasFortWorthPage,
});

function DallasFortWorthPage() {
  return <CityPage config={config} liveArticles={Route.useLoaderData()} />;
}
