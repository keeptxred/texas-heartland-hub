import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/texas-comptroller")({
  beforeLoad: () => {
    throw redirect({ href: "/texas-government/comptroller", statusCode: 301 });
  },
});
