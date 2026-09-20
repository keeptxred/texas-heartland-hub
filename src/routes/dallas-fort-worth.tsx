import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dallas-fort-worth")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/article/moving-to-dallas-fort-worth-guide${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
