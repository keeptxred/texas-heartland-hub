import { createFileRoute } from "@tanstack/react-router";
import { ElectionRepositoryProvider } from "@/lib/elections/repositories";
import { ElectionForecastListPage } from "@/pages/elections";

export const Route = createFileRoute("/elections/forecast")({
  head: () => ({
    meta: [
      { title: "Texas Election Forecasts | KeepTXRed Election Central" },
      {
        name: "description",
        content:
          "Review published Texas election forecasts with providers, race ratings, candidate probabilities, updates, and methodology disclosures.",
      },
      {
        property: "og:title",
        content: "Texas Election Forecasts | KeepTXRed Election Central",
      },
      { property: "og:url", content: "/elections/forecast" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://keeptxred.com/elections/forecast",
      },
    ],
  }),
  component: ElectionForecastRoute,
});

function ElectionForecastRoute() {
  return (
    <ElectionRepositoryProvider>
      <ElectionForecastListPage />
    </ElectionRepositoryProvider>
  );
}
