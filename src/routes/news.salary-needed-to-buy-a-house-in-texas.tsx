import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/news/salary-needed-to-buy-a-house-in-texas")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/article/salary-needed-to-buy-a-house-in-texas${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
