import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/texas-mortgage-qualification-calculator")({
  beforeLoad: ({ location }) => {
    throw redirect({ href: `https://texasdefined.com/texas-home-affordability-calculator${location.searchStr || ""}`, statusCode: 301 });
  },
});
