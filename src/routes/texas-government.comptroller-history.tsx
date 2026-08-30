import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/texas-government/comptroller-history")({
  beforeLoad: ({ location }) => {
    throw redirect({ href: `/texas-government/comptroller${location.searchStr || ""}`, statusCode: 301 });
  },
});
