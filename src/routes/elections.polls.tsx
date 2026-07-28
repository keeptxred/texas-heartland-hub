import { createFileRoute } from "@tanstack/react-router";
import { ElectionRepositoryProvider } from "@/lib/elections/repositories";
import { ElectionPollListPage } from "@/pages/elections";

export const Route = createFileRoute("/elections/polls")({
  head: () => ({
    meta: [
      { title: "Texas Election Polls | KeepTXRed Election Central" },
      {
        name: "description",
        content:
          "Review published Texas election polls with field dates, sample populations, sponsors, toplines, and methodology disclosures.",
      },
      {
        property: "og:title",
        content: "Texas Election Polls | KeepTXRed Election Central",
      },
      { property: "og:url", content: "/elections/polls" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://keeptxred.com/elections/polls",
      },
    ],
  }),
  component: ElectionPollsRoute,
});

function ElectionPollsRoute() {
  return (
    <ElectionRepositoryProvider>
      <ElectionPollListPage />
    </ElectionRepositoryProvider>
  );
}
