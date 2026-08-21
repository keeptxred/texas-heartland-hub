import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/news/true-cost-of-owning-a-home-in-texas")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/article/true-cost-of-owning-a-home-in-texas${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
