import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/explore/")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/explore${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
