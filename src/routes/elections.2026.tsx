import { createFileRoute } from "@tanstack/react-router";
import { ElectionRepositoryProvider } from "@/lib/elections/repositories";
import { ElectionHomePage } from "@/pages/elections";

export const Route = createFileRoute("/elections/2026" as never)({
  head: () => ({
    meta: [
      { title: "2026 Texas Election Central | Races, Candidates, Polls & Voting" },
      {
        name: "description",
        content:
          "Follow 2026 Texas election races, candidates, polls, forecasts, results, and practical voting information from Keep TX Red Election Central.",
      },
      { property: "og:title", content: "2026 Texas Election Central | Keep TX Red" },
      {
        property: "og:description",
        content:
          "2026 Texas race ratings, candidate profiles, polling, forecasts, results, and voter guidance in one election hub.",
      },
      { property: "og:url", content: "/elections/2026" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://keeptxred.com/elections/2026" }],
  }),
  component: ElectionCentral2026Route,
});

function ElectionCentral2026Route() {
  return (
    <ElectionRepositoryProvider>
      <ElectionHomePage />
    </ElectionRepositoryProvider>
  );
}
