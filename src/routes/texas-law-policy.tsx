import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/texas-law-policy")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `/laws${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
