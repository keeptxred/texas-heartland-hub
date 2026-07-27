import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/texas-property-tax-calculator")({
  beforeLoad: () => {
    throw redirect({ to: "/tax-calculator", statusCode: 301 });
  },
});
