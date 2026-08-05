import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/news/non-political")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/texas-living${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
