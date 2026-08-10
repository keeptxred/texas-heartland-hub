import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/texas-news")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `/news${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
