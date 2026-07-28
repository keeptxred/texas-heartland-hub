import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/elections")({
  head: () => ({
    meta: [
      { title: "2026 Texas Election Central | KeepTXRed" },
      {
        name: "description",
        content:
          "Follow verified 2026 Texas races, candidates, polls, forecasts, results, and voting information in KeepTXRed Election Central.",
      },
    ],
    links: [{ rel: "canonical", href: "https://keeptxred.com/elections/2026" }],
  }),
  beforeLoad: () => {
    throw redirect({ to: "/elections/2026" as never });
  },
  component: () => null,
});
