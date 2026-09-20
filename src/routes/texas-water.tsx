import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/texas-water")({
  beforeLoad: ({ location }) => {
    throw redirect({ href: `/issues/texas-water-policy${location.searchStr || ""}`, statusCode: 301 });
  },
});
