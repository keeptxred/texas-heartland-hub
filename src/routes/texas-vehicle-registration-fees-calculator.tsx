import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/texas-vehicle-registration-fees-calculator")({
  beforeLoad: () => {
    throw redirect({ to: "/find-my-dmv", statusCode: 301 });
  },
});
