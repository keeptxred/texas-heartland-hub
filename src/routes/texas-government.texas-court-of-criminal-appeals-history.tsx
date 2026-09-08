import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/texas-government/texas-court-of-criminal-appeals-history")({
  beforeLoad: () => {
    throw redirect({ to: "/texas-government/court-of-criminal-appeals-history", statusCode: 301 });
  },
  component: () => null,
});
