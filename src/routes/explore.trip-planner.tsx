import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/explore/trip-planner")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/explore/trip-planner${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
