import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/texas-attorney-general")({
  beforeLoad: () => {
    throw redirect({ href: "/texas-government/attorney-general", statusCode: 301 });
  },
});
