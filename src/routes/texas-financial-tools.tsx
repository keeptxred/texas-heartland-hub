import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/texas-financial-tools")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/decide/financial-tools${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
