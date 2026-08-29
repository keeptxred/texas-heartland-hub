import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/explore/$slug")({
  beforeLoad: ({ params, location }) => {
    throw redirect({
      href: `https://texasdefined.com/explore/${encodeURIComponent(params.slug)}${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
