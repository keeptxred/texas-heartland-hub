import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/news/texas-home-equity-heloc-guide")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/article/texas-home-equity-heloc-guide${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
