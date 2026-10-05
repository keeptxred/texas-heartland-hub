import { createFileRoute, Link } from "@tanstack/react-router";
import TexasLegislaturePage from "@/components/legislature/TexasLegislaturePage";
import { LegislatureHubTrustPanel } from "@/components/legislature/LegislatureHubTrustPanel";
import { legislatureSeo } from "@/lib/legislature-seo";

const EMPTY_BILLS_SEARCH = { q: "", status: "", legislature: 0, chamber: "", billType: "", page: 1 } as const;
const title = "Texas Legislature: Bills, House, Senate & Current Session";
const description = "Texas Legislature guide with bill search, House and Senate resources, current and past sessions, committees, lawmakers, votes, elections and official legislative records.";

export const Route = createFileRoute("/texas-legislature/")({
  head: () => legislatureSeo({ title, description, path: "/texas-legislature", breadcrumb: title }),
  component: LegislatureHubRoute,
});

function LegislatureHubRoute() {
  return <>
    <TexasLegislaturePage page="hub" />
    <section className="mx-auto max-w-6xl px-4 pb-12" aria-labelledby="legislature-search-reference">
      <div className="rounded-xl border bg-card p-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Texas Legislature search</p>
        <h2 id="legislature-search-reference" className="mt-2 text-2xl font-bold text-foreground">
          Search Texas bills, sessions, committees and lawmakers
        </h2>
        <p className="mt-3 max-w-4xl leading-7 text-muted-foreground">
          Use KeepTXRed's Texas Legislature bill search when you know a bill number, caption or subject. Use the Legislature hub to move between the House, Senate, current-session reference, committees, votes and lawmakers, then verify official text and actions with Texas Legislature Online.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link to="/bills" search={EMPTY_BILLS_SEARCH} className="rounded-lg border px-4 py-3 font-semibold text-primary hover:border-primary">Texas bill search →</Link>
          <Link to="/texas-legislature/current-session" className="rounded-lg border px-4 py-3 font-semibold text-primary hover:border-primary">Current session →</Link>
          <Link to="/texas-legislature/committees" className="rounded-lg border px-4 py-3 font-semibold text-primary hover:border-primary">Committees →</Link>
          <a href="https://capitol.texas.gov/" target="_blank" rel="noopener noreferrer" className="rounded-lg border px-4 py-3 font-semibold text-primary hover:border-primary">Official Legislature site →</a>
        </div>
      </div>
    </section>
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
