import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/find-my-dmv")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/find-my-dmv${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
