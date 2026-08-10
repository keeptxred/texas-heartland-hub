import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/texas-laws")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `/laws${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
