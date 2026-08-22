import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/austin")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/article/moving-to-austin-guide${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
