import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/committees")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `/texas-legislature/committees${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
