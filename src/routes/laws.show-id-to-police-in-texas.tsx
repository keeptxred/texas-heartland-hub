import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/laws/show-id-to-police-in-texas")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `/guides/texas-failure-to-identify-law${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
