import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/texas-property-tax-increase-calculator")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com${location.pathname}${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
