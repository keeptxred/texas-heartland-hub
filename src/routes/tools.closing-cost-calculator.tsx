import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/tools/closing-cost-calculator")({
  beforeLoad: ({ location }) => {
    throw redirect({ href: `https://texasdefined.com/texas-closing-cost-calculator${location.searchStr || ""}`, statusCode: 301 });
  },
});
