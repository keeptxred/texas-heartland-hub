import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/voting-locations")({
  beforeLoad: () => {
    throw redirect({ href: "/elections/voting", statusCode: 301 });
  },
});
