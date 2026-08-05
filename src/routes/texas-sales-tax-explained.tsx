import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/texas-sales-tax-explained")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/texas-sales-tax-explained${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
