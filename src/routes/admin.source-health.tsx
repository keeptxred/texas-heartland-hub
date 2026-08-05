import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { NewsSourceHealthPanel } from "@/components/admin/NewsSourceHealthPanel";

export const Route = createFileRoute("/admin/source-health")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && sessionStorage.getItem("ktr-admin-ok") !== "1") {
      throw redirect({ to: "/admin" });
    }
  },
  head: () => ({
    meta: [
      { title: "Source Health — Keep TX Red Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SourceHealthPage,
});

function SourceHealthPage() {
  return (
    <main className="min-h-screen bg-muted/20">
      <header className="border-b-4 border-primary bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">★ Newsroom QA</div>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl md:text-5xl">Source Health</h1>
              <p className="mt-2 text-sm text-white/80">
                Confirm which enabled feeds are delivering stories and how often those stories become Keep TX Red articles.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/admin/coverage-gaps" className="border border-white/40 px-3 py-2 text-sm font-semibold hover:bg-white/10">
                Coverage gaps
              </Link>
              <Link to="/admin" className="border border-white/40 px-3 py-2 text-sm font-semibold hover:bg-white/10">
                Back to dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <NewsSourceHealthPanel />
      </div>
    </main>
  );
}
