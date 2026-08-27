import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/texas-energy-policy")({
  beforeLoad: ({ location }) => {
    throw redirect({ href: `/texas-energy${location.searchStr || ""}`, statusCode: 301 });
  },
});
