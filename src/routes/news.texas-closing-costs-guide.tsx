import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/news/texas-closing-costs-guide")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/article/texas-closing-costs-guide${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
