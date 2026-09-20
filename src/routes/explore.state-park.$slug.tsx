import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/explore/state-park/$slug")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com${location.pathname}${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
