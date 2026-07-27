import { createFileRoute } from "@tanstack/react-router";
import { ElectionHomePage } from "@/pages/elections";

export const Route = createFileRoute("/elections")({
  head: () => ({
    meta: [
      { title: "Texas Election Central | Races, Candidates, Polls & Voting" },
      {
        name: "description",
        content:
          "Follow Texas election races, candidates, polls, forecasts, results, and practical voting information from Keep TX Red Election Central.",
      },
      {
        property: "og:title",
        content: "Texas Election Central | Keep TX Red",
      },
      {
        property: "og:description",
        content:
          "Texas race ratings, candidate profiles, polling, forecasts, results, and voter guidance in one election hub.",
      },
      { property: "og:url", content: "/elections" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://keeptxred.com/elections" }],
  }),
  component: ElectionHomePage,
});
