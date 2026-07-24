import { createFileRoute } from "@tanstack/react-router";
import { CityPage } from "@/components/city-page";
import { TEXAS_CITIES } from "@/data/texas-cities";
import { getArticlesByCategory } from "@/lib/category-feed.functions";

const config = TEXAS_CITIES.austin;

export const Route = createFileRoute("/austin")({
  loader: () =>
    getArticlesByCategory({
      data: { region: config.region, limit: 12, order: "newest" },
    }),
  head: () => ({
    meta: [
      { title: "Moving to Austin: City Guide, Tools & Local News | Keep TX Red" },
      {
        name: "description",
        content:
          "Plan a move to Austin with practical guidance on housing costs, technology jobs, commutes, property taxes, schools, utilities, and current Austin-area coverage.",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.keeptxred.com/austin" }],
  }),
  component: AustinPage,
});

function AustinPage() {
  return <CityPage config={config} liveArticles={Route.useLoaderData()} />;
}
