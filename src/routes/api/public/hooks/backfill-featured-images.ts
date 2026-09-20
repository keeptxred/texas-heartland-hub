import { createFileRoute } from "@tanstack/react-router";

// Retired legacy endpoint. Image recovery is now handled only through the
// GitHub Actions OIDC-protected recovery routes/workflows. Keeping this route
// as a 410 avoids breaking generated route metadata while preventing anonymous
// callers from triggering Cloudflare image-generation spend or overwrites.
function gone() {
  return Response.json(
    {
      error: "This legacy image backfill endpoint has been retired.",
      replacement: "OIDC-protected image backlog recovery",
    },
    { status: 410 },
  );
}

export const Route = createFileRoute("/api/public/hooks/backfill-featured-images")({
  server: {
    handlers: {
      GET: gone,
      POST: gone,
    },
  },
});
