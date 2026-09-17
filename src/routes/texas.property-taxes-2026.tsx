import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/texas/property-taxes-2026")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/learn/property-taxes${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
