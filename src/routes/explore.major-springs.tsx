import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/explore/major-springs")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/explore/major-springs${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
