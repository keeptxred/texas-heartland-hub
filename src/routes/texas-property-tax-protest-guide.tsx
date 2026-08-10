import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/texas-property-tax-protest-guide")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/do/property-tax-protest${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
