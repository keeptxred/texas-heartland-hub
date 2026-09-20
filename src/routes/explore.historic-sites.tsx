import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/explore/historic-sites")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/explore/historic-sites${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
