import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/laws/texas-election-laws")({
  beforeLoad: ({ location }) => {
    throw redirect({ href: `/news/texas-election-laws-explained${location.searchStr || ""}`, statusCode: 301 });
  },
});
