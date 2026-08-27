import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/tools/property-tax-calculator")({
  beforeLoad: ({ location }) => {
    throw redirect({ href: `https://texasdefined.com/decide/property-taxes${location.searchStr || ""}`, statusCode: 301 });
  },
});
