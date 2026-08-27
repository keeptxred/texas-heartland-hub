import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/texas-refinance-calculator")({
  beforeLoad: ({ location }) => {
    throw redirect({ href: `https://texasdefined.com/texas-refinance-savings-calculator${location.searchStr || ""}`, statusCode: 301 });
  },
});
