import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/explore/lighthouses")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/explore/lighthouses${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
