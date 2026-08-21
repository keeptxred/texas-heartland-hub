import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/news/should-you-refinance-texas-mortgage")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/article/should-you-refinance-texas-mortgage${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
