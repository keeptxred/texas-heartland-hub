import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { legacyNewsRedirect } from "@/lib/legacy-news";

export const Route = createFileRoute("/news/live-$legacySlug")({
  loader: ({ params }) => {
    const fullSlug = `live-${params.legacySlug}`;
    const replacement = legacyNewsRedirect(fullSlug);
    if (replacement) {
      throw redirect({ href: replacement, statusCode: 301 });
    }

    // These URLs belong to the retired pre-remediation newsroom corpus. A real
    // 404 is preferable to a soft-404 page or an unrelated redirect: search
    // engines can retire the obsolete URL without transferring weak relevance
    // signals to a page that is not an equivalent replacement.
    throw notFound();
  },
  head: () => ({
    meta: [
      { title: "Article retired — Keep TX Red" },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
  notFoundComponent: () => (
    <main className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="font-display text-4xl mb-3">Article Retired</h1>
      <p className="text-muted-foreground mb-6">
        This older newsroom page has been retired as part of our editorial-quality cleanup.
      </p>
      <Link to="/news" className="text-primary underline">
        Browse current reporting
      </Link>
    </main>
  ),
});
