import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/find-my-school-district")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/find-my-school-district${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
