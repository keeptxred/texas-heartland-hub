import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { buildSeo } from "@/lib/seo";

const EXAMPLES = ["property tax", "school choice", "border security", "ERCOT", "water", "gun rights", "election integrity", "Medicaid"];
const EMPTY_BILL_FILTERS = { status: "", legislature: 0, chamber: "", billType: "", page: 1 } as const;

export const Route = createFileRoute("/civic-tools/bill-finder")({
  head: () => {
    const seo = buildSeo({
      title: "Texas Bill Finder: Search Legislation by Issue",
      description: "Enter a Texas policy issue and jump directly into Keep TX Red's bill database to find matching House bills, Senate bills, sponsors, committees, actions, and official documents.",
      path: "/civic-tools/bill-finder",
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: BillFinder,
});

function BillFinder() {
  const [query, setQuery] = useState("");
  const trimmed = query.trim();
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb"><Link to="/">Home</Link> / <Link to="/civic-tools">Civic Tools</Link> / Bill Finder</nav>
      <header className="mt-6 max-w-4xl">
        <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-primary">Texas Legislature tool</p>
        <h1 className="mt-3 font-display text-5xl tracking-tight sm:text-6xl">Texas Bill Finder</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">Start with the issue you care about. This tool hands that issue directly to KTR's maintained Texas bill database, where you can narrow by Legislature, chamber, bill type, and status and open the official history for each matching bill.</p>
      </header>

      <section className="mt-8 rounded-2xl border bg-card p-6 sm:p-8">
        <label htmlFor="bill-issue" className="text-sm font-bold">What issue are you tracking?</label>
        <input id="bill-issue" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Example: property tax relief" className="mt-3 h-12 w-full rounded-lg border bg-background px-4 text-base outline-none focus:border-primary" />
        <div className="mt-4 flex flex-wrap gap-2">{EXAMPLES.map((example) => <button key={example} type="button" onClick={() => setQuery(example)} className="rounded-full border px-3 py-1.5 text-xs font-semibold hover:border-primary hover:text-primary">{example}</button>)}</div>
        {trimmed ? (
          <Link
            to="/bills"
            search={{ q: trimmed, ...EMPTY_BILL_FILTERS }}
            className="mt-6 inline-flex rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
          >
            Search Texas bills for “{trimmed}” →
          </Link>
        ) : null}
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <Info title="Search the official record" text="Matching bill pages connect captions and subjects to sponsors, committees, legislative actions, documents, and related authority records." />
        <Info title="Then narrow it" text="Use the bill database filters for Legislature, chamber, bill type, and legislative status after opening your issue search." />
        <Info title="Verify the text" text="For exact legal effects, use the official bill text, analyses, fiscal notes, and action history linked from the bill record." />
      </section>
    </main>
  );
}

function Info({ title, text }: { title: string; text: string }) {
  return <div className="rounded-xl border bg-card p-5"><h2 className="font-display text-xl tracking-tight">{title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></div>;
}
