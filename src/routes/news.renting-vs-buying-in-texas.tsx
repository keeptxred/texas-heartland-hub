import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/news/renting-vs-buying-in-texas")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/article/renting-vs-buying-in-texas${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
