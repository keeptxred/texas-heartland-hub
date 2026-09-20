import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/elections/")({
  head: () => ({
    meta: [
      { title: "2026 Texas Election Central | Keep TX Red" },
      {
        name: "description",
        content:
          "Follow verified 2026 Texas races, candidates, polls, forecasts, results, and voting information in Keep TX Red Election Central.",
      },
    ],
    links: [{ rel: "canonical", href: "https://keeptxred.com/elections" }],
  }),
  beforeLoad: () => {
    throw redirect({ to: "/elections/2026" });
  },
  component: () => null,
});
