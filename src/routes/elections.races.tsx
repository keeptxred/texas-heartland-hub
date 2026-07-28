import { createFileRoute } from "@tanstack/react-router";
import { ElectionRepositoryProvider } from "@/lib/elections/repositories";
import { ElectionRaceListPage } from "@/pages/elections";

export const Route = createFileRoute("/elections/races")({
  head: () => ({
    meta: [
      { title: "Texas Election Races | KeepTXRed Election Central" },
      {
        name: "description",
        content:
          "Browse verified Texas election races, candidates, election dates, ratings, and reporting status.",
      },
      {
        property: "og:title",
        content: "Texas Election Races | KeepTXRed Election Central",
      },
      {
        property: "og:description",
        content:
          "Follow published statewide, congressional, legislative, county, and local Texas election races.",
      },
      { property: "og:url", content: "/elections/races" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://keeptxred.com/elections/races",
      },
    ],
  }),
  component: ElectionRacesRoute,
});

function ElectionRacesRoute() {
  return (
    <ElectionRepositoryProvider>
      <ElectionRaceListPage />
    </ElectionRepositoryProvider>
  );
}
