import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/laws-to-know")({
  beforeLoad: () => {
    throw redirect({ href: "/laws", statusCode: 301 });
  },
});
