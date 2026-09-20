import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/politics")({
  beforeLoad: ({ location }) => {
    throw redirect({ href: `/texas-politics${location.searchStr || ""}`, statusCode: 301 });
  },
});
