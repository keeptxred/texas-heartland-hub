import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/san-antonio")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/article/moving-to-san-antonio-guide${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
