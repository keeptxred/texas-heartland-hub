import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/laws/texas-gun-laws")({
  beforeLoad: ({ location }) => {
    throw redirect({ href: `/news/texas-gun-laws-explained${location.searchStr || ""}`, statusCode: 301 });
  },
});
