import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/news/texas-utility-costs-guide")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/article/texas-utility-costs-guide${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
