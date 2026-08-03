import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/living-in-texas")({
  beforeLoad: () => {
    throw redirect({ href: "/texas-living", statusCode: 301 });
  },
});
