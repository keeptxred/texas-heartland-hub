import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/texas-living")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/texas-living${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
