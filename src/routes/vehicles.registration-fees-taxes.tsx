import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/vehicles/registration-fees-taxes")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/texas-vehicle-registration-fees-taxes${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
