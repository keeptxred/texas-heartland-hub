import { createFileRoute, Link } from "@tanstack/react-router";
import { NewsCoverageGapPanel } from "@/components/admin/NewsCoverageGapPanel";

export const Route = createFileRoute("/admin/coverage-gaps")({
  head: () => ({
    meta: [
      { title: "Coverage Gaps — Keep TX Red Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CoverageGapsPage,
});

function CoverageGapsPage() {
  return (
    <main className="min-h-screen bg-muted/20">
      <header className="border-b-4 border-primary bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">★ Newsroom QA</div>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl md:text-5xl">Coverage Gaps</h1>
              <p className="mt-2 text-sm text-white/80">
                Important Texas stories that reached the feed but did not become native Keep TX Red articles.
              </p>
            </div>
            <Link to="/admin" className="border border-white/40 px-3 py-2 text-sm font-semibold hover:bg-white/10">
              Back to dashboard
            </Link>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <NewsCoverageGapPanel />
      </div>
    </main>
  );
}
