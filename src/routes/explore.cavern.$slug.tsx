import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/explore/cavern/$slug")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/explore/$slug", params: { slug: params.slug }, statusCode: 301 });
  },
});
