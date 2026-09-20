import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/laws/texas-property-tax-laws-explained")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `/news/texas-property-tax-laws-explained${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
