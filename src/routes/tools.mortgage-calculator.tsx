import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/tools/mortgage-calculator")({
  beforeLoad: ({ location }) => {
    throw redirect({ href: `https://texasdefined.com/texas-mortgage-calculator${location.searchStr || ""}`, statusCode: 301 });
  },
});
