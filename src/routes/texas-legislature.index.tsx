import { createFileRoute, Link } from "@tanstack/react-router";
import TexasLegislaturePage from "@/components/legislature/TexasLegislaturePage";
import { LegislatureHubTrustPanel } from "@/components/legislature/LegislatureHubTrustPanel";
import { legislatureSeo } from "@/lib/legislature-seo";

const title = "Texas Legislature";
const description = "Explore the Texas Legislature, House, Senate, current legislative session, past sessions, lawmakers, elections, laws, and policy coverage.";

export const Route = createFileRoute("/texas-legislature/")({
  head: () => legislatureSeo({ title, description, path: "/texas-legislature", breadcrumb: title }),
  component: LegislatureHubRoute,
});

function LegislatureHubRoute() {
  return <>
    <TexasLegislaturePage page="hub" />
    <section className="mx-auto max-w-6xl px-4 pb-12" aria-labelledby="legislature-election-central-links">
      <div className="rounded-xl border bg-card p-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">2026 election context</p>
        <h2 id="legislature-election-central-links" className="mt-2 text-2xl font-bold text-foreground">
          Follow the elections that determine the next Texas Legislature
        </h2>
        <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
          Election Central connects legislative districts and offices to verified 2026 races and published candidate profiles.
        </p>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 font-semibold">
          <Link to="/elections/2026" className="text-primary hover:underline">2026 Texas Election Central →</Link>
          <Link to="/elections/candidates" className="text-primary hover:underline">Browse verified Texas candidates →</Link>
          <Link to="/elections/legislative" className="text-primary hover:underline">Texas legislative races →</Link>
        </div>
      </div>
    </section>
    <LegislatureHubTrustPanel />
  </>;
}
