import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/texas-first-time-homebuyer-programs")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/texas-first-time-homebuyer-programs${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
