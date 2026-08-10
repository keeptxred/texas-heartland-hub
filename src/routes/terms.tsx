import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy legal URL retained only as a permanent redirect. */
export const Route = createFileRoute("/terms")({
  beforeLoad: () => {
    throw redirect({ href: "/terms-of-service", statusCode: 301 });
  },
});
