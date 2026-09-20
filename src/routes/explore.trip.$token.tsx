import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/explore/trip/$token")({
  beforeLoad: ({ params, location }) => {
    throw redirect({
      href: `https://texasdefined.com/explore/trip/${encodeURIComponent(params.token)}${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
