import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/texas-political-figures")({
  loader: () => {
    throw redirect({ to: "/texas-politics/figures", statusCode: 301 });
  },
});
