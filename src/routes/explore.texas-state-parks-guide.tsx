import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/explore/texas-state-parks-guide")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/explore/texas-state-parks-guide${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
