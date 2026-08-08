import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/legislative-updates")({
  beforeLoad: () => {
    throw redirect({ href: "/bills", statusCode: 301 });
  },
});
