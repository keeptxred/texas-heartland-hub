import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/moving-to-texas-checklist")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com${location.pathname}${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
