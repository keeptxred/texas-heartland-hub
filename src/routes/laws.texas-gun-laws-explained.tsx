import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/laws/texas-gun-laws-explained")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `/news/texas-gun-laws-explained${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
