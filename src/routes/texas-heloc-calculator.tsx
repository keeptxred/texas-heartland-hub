import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/texas-heloc-calculator")({
  beforeLoad: ({ location }) => {
    throw redirect({ href: `https://texasdefined.com/texas-home-equity-calculator${location.searchStr || ""}`, statusCode: 301 });
  },
});
