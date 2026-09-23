import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/news/moving-to-texas-guide")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/article/moving-to-texas-what-nobody-tells-you${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
