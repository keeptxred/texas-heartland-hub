import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/texas-home-ownership-cost-calculator")({
  beforeLoad: ({ location }) => {
    throw redirect({ href: `https://texasdefined.com/texas-homeownership-cost-calculator${location.searchStr || ""}`, statusCode: 301 });
  },
});
