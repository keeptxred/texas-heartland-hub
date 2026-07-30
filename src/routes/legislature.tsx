import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/legislature")({
  beforeLoad: () => {
    throw redirect({ to: "/texas-legislature" });
  },
});
