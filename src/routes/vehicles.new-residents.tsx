import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/vehicles/new-residents")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/texas-vehicle-registration${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
