import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/tools/texas-utilities-calculator")({
  beforeLoad: ({ location }) => {
    throw redirect({ href: `https://texasdefined.com/texas-utility-cost-calculator${location.searchStr || ""}`, statusCode: 301 });
  },
});
