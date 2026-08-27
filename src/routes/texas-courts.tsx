import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/texas-courts")({
  beforeLoad: ({ location }) => {
    throw redirect({ href: `/texas-government${location.searchStr || ""}`, statusCode: 301 });
  },
});
