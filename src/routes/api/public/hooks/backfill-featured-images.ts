import { createFileRoute } from "@tanstack/react-router";
import {
  backfillBatch,
  generateFeaturedImageForSlugDirect,
} from "@/lib/featured-image.functions";

// Featured-image hook used by scheduled publishing and remediation.
// - ?slug=<article-slug> generates/regenerates exactly that article image.
// - without slug, falls back to the bounded backlog batch mode.
// This deterministic slug path prevents a newly published scheduled article from
// being skipped behind unrelated backlog rows.
async function handle(request: Request) {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug")?.trim() ?? "";
  const overwrite = url.searchParams.get("overwrite") === "1";

  if (slug) {
    if (slug.length > 200 || !/^[a-z0-9-]+$/i.test(slug)) {
      return Response.json({ ok: false, error: "Invalid slug" }, { status: 400 });
    }
    const result = await generateFeaturedImageForSlugDirect(slug, overwrite);
    return Response.json(result, { status: result.ok ? 200 : 500 });
  }

  const raw = Number(url.searchParams.get("limit") ?? "5");
  const limit = Math.max(1, Math.min(20, Number.isFinite(raw) ? raw : 5));
  const result = await backfillBatch(limit, overwrite);
  return Response.json(result);
}

export const Route = createFileRoute("/api/public/hooks/backfill-featured-images")({
  server: {
    handlers: {
      GET: async ({ request }) => handle(request),
      POST: async ({ request }) => handle(request),
    },
  },
});