import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/explore/texas-wildflower-seasons")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/explore/texas-wildflower-seasons${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
