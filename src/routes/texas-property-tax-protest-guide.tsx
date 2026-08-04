import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/texas-property-tax-protest-guide")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com${location.pathname}${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
