import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/vehicles/new-residents")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/find-my-dmv${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
