import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/texas-child-support")({
  beforeLoad: () => {
    throw redirect({ href: "/guides/texas-child-support-guidelines-law", statusCode: 301 });
  },
});
