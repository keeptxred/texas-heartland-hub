import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/explore/wildlife-management-areas")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/explore/wildlife-management-areas${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
