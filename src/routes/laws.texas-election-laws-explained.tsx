import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/laws/texas-election-laws-explained")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `/news/texas-election-laws-explained${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
