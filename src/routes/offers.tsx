import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/offers")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/offers${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
