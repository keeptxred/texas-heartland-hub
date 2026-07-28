import { createFileRoute } from "@tanstack/react-router";
import { ElectionRepositoryProvider } from "@/lib/elections/repositories";
import { ElectionResultsListPage } from "@/pages/elections";

export const Route = createFileRoute("/elections/results")({
  head: () => ({
    meta: [
      { title: "Texas Election Results | KeepTXRed Election Central" },
      {
        name: "description",
        content:
          "Follow published Texas election results with reporting progress, candidate vote totals, source attribution, and certification status.",
      },
      {
        property: "og:title",
        content: "Texas Election Results | KeepTXRed Election Central",
      },
      { property: "og:url", content: "/elections/results" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://keeptxred.com/elections/results",
      },
    ],
  }),
  component: ElectionResultsRoute,
});

function ElectionResultsRoute() {
  return (
    <ElectionRepositoryProvider>
      <ElectionResultsListPage isLoading />
    </ElectionRepositoryProvider>
  );
}
