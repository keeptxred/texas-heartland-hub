import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/tools/home-insurance-calculator")({
  beforeLoad: ({ location }) => {
    throw redirect({ href: `https://texasdefined.com/texas-home-insurance-calculator${location.searchStr || ""}`, statusCode: 301 });
  },
});
