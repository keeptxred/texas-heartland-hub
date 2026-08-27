import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/ercot-texas-power-grid")({
  beforeLoad: ({ location }) => {
    throw redirect({ href: `/issues/ercot-grid-reliability${location.searchStr || ""}`, statusCode: 301 });
  },
});
