import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/property-taxes")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/learn/property-taxes${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
