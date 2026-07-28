import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/elections")({
  head: () => ({
    meta: [
      { title: "Texas Election Central 2026 | Keep TX Red" },
      {
        name: "description",
        content:
          "Follow verified Texas 2026 races, candidates, polls, forecasts, results, and voting information in Keep TX Red Election Central.",
      },
      { name: "robots", content: "noindex,follow" },
    ],
    links: [{ rel: "canonical", href: "https://keeptxred.com/elections/2026" }],
  }),
  beforeLoad: () => {
    throw redirect({ to: "/elections/2026" });
  },
  component: () => null,
});
