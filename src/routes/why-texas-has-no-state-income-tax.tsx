import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/why-texas-has-no-state-income-tax")({
  beforeLoad: ({ location }) => {
    throw redirect({ href: `/news/why-texas-has-no-income-tax${location.searchStr || ""}`, statusCode: 301 });
  },
});
