import { createFileRoute, Outlet } from "@tanstack/react-router";

/**
 * KTR is refocusing indexed discovery on Texas politics, elections, government,
 * law, policy, and material business/economic coverage. Preserve the existing
 * sports URLs for users and historical links, but keep this entire route tree
 * out of search while that topical boundary is in effect.
 */
export const Route = createFileRoute("/texas-sports")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex,follow,max-image-preview:large" }],
  }),
  component: () => <Outlet />,
});
