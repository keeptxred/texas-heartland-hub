import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/laws/texas-new-laws-2026")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `/news/texas-new-laws-2026${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
