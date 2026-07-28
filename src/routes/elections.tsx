import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/elections")({
  beforeLoad: () => {
    throw redirect({ to: "/elections/2026" as never });
  },
  component: () => null,
});
