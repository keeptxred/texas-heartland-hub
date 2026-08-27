import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/texas/property-taxes-2026")({
  beforeLoad: ({ location }) => {
    throw redirect({ href: `/news/texas-property-tax-guide${location.searchStr || ""}`, statusCode: 301 });
  },
});
