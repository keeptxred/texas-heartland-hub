import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/explore/texas-scenic-drives")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/explore/texas-scenic-drives${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
