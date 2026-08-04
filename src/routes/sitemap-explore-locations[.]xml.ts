import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

// Explore Texas moved to texasdefined.com. Sitemap ownership transferred.
export const Route = createFileRoute("/sitemap-explore-locations.xml")({
  server: {
    handlers: {
      GET: () =>
        new Response(null, {
          status: 301,
          headers: { Location: "https://texasdefined.com/sitemap-explore.xml" },
        }),
    },
  },
});
