import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { NewsCoverageGapPanel } from "@/components/admin/NewsCoverageGapPanel";
import { NewsSourceHealthPanel } from "@/components/admin/NewsSourceHealthPanel";
import { PillarAuthorityPanel } from "@/components/admin/PillarAuthorityPanel";

const STORAGE_KEY = "ktr-admin-ok";

export const Route = createFileRoute("/admin/coverage-gaps")({
  head: () => ({
    meta: [
      { title: "Newsroom Coverage QA — Keep TX Red Admin" },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: CoverageGapsPage,
});

function CoverageGapsPage() {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") {
      setAuthorized(true);
      return;
    }
    void navigate({ to: "/admin", replace: true });
  }, [navigate]);

  if (!authorized) {
    return <main className="min-h-screen bg-muted/20" />;
  }

  return (
    <main className="min-h-screen bg-muted/20">
      <header className="border-b-4 border-primary bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">★ Newsroom QA</div>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl md:text-5xl">Coverage &amp; Authority</h1>
              <p className="mt-2 text-sm text-white/80">
                Find missed stories, unhealthy sources, and the content pillars that most need additional depth.
              </p>
            </div>
            <Link to="/admin" className="border border-white/40 px-3 py-2 text-sm font-semibold hover:bg-white/10">
              Back to dashboard
            </Link>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl space-y-12 px-4 py-8">
        <section aria-labelledby="pillar-authority-heading">
          <h2 id="pillar-authority-heading" className="mb-4 font-display text-2xl">Pillar Authority</h2>
          <PillarAuthorityPanel />
        </section>
        <section aria-labelledby="coverage-gaps-heading" className="border-t pt-10">
          <h2 id="coverage-gaps-heading" className="mb-4 font-display text-2xl">Coverage Gaps</h2>
          <NewsCoverageGapPanel />
        </section>
        <section aria-labelledby="source-health-heading" className="border-t pt-10">
          <h2 id="source-health-heading" className="mb-4 font-display text-2xl">Source Health</h2>
          <NewsSourceHealthPanel />
        </section>
      </div>
    </main>
  );
}
