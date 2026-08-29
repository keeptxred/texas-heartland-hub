import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/explore/texas-dark-sky-stargazing")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/explore/texas-dark-sky-stargazing${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
