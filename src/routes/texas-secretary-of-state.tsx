import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/texas-secretary-of-state")({
  beforeLoad: () => {
    throw redirect({ href: "/texas-government/secretary-of-state", statusCode: 301 });
  },
});
