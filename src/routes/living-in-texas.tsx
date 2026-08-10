import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/living-in-texas")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/texas-living${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
