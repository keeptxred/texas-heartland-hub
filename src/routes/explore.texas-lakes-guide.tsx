import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/explore/texas-lakes-guide")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/explore/texas-lakes-guide${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
