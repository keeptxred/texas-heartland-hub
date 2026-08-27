import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/explore/state-parks")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/explore/state-parks${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
