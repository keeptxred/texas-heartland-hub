import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/explore/lake/$slug")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/explore/$slug", params: { slug: params.slug }, statusCode: 301 });
  },
});
