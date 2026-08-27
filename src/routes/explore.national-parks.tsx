import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/explore/national-parks")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/explore/national-parks${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
