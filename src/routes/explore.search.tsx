import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/explore/search")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/explore/search${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
