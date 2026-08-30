import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/texas-government/texas-judicial-selection-history")({
  beforeLoad: ({ location }) => {
    throw redirect({ href: `/texas-government/judicial-selection-elections${location.searchStr || ""}`, statusCode: 301 });
  },
});
