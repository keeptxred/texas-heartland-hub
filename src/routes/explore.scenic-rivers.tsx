import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/explore/scenic-rivers")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/explore/scenic-rivers${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
