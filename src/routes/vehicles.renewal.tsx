import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/vehicles/renewal")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/texas-vehicle-registration-renewal${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
