import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { getGovernmentGraphLinks } from "@/lib/government-graph";
import { buildSeo } from "@/lib/seo";

const EXAMPLES = ["Who regulates ERCOT?", "Who controls school accountability?", "Where do I challenge a property appraisal?", "Who regulates oil and gas pipelines?", "Who handles Texas water planning?", "Who sets election rules?"];

export const Route = createFileRoute("/civic-tools/government-authority-finder")({
  head: () => {
    const seo = buildSeo({
      title: "Who Controls This? Texas Government Authority Finder",
      description: "Describe a Texas government issue and find the agency, law, policy tracker, data source, Legislature resource, representative directory, or election authority most likely to control it.",
      path: "/civic-tools/government-authority-finder",
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: GovernmentAuthorityFinder,
});

function GovernmentAuthorityFinder() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => query.trim().length >= 3 ? getGovernmentGraphLinks(query, 10) : [], [query]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb"><Link to="/">Home</Link> / <Link to="/civic-tools">Civic Tools</Link> / Authority Finder</nav>
      <header className="mt-6 max-w-4xl">
        <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-primary">Government Graph tool</p>
        <h1 className="mt-3 font-display text-5xl tracking-tight sm:text-6xl">Who Controls This?</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">Type the Texas government problem in ordinary language. KTR will route you to the strongest matching permanent authority pages instead of making you guess which department, code, regulator, or legislative body owns the issue.</p>
      </header>

      <section className="mt-8 rounded-2xl border bg-card p-6 sm:p-8">
        <label htmlFor="authority-query" className="text-sm font-bold">Describe the issue</label>
        <div className="mt-3 flex gap-3">
          <input id="authority-query" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Example: Who regulates the Texas electric grid?" className="min-w-0 flex-1 rounded-lg border bg-background px-4 py-3 text-base outline-none focus:border-primary" />
          {query ? <button type="button" onClick={() => setQuery("")} className="rounded-lg border px-4 py-3 text-sm font-semibold">Clear</button> : null}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">{EXAMPLES.map((example) => <button key={example} type="button" onClick={() => setQuery(example)} className="rounded-full border px-3 py-1.5 text-xs font-semibold hover:border-primary hover:text-primary">{example}</button>)}</div>
      </section>

      {query.trim().length >= 3 ? (
        <section className="mt-9">
          <h2 className="font-display text-3xl tracking-tight">Best matching authority</h2>
          {results.length ? <div className="mt-5 grid gap-4 md:grid-cols-2">{results.map((result, index) => (
            <a key={result.href} href={result.href} className="rounded-xl border bg-card p-5 hover:border-primary">
              <div className="flex items-center justify-between gap-3"><span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary">{index === 0 ? "Best match" : result.kind}</span><span className="rounded border px-2 py-0.5 text-[9px] font-bold uppercase text-muted-foreground">{result.kind}</span></div>
              <h3 className="mt-2 font-display text-xl tracking-tight">{result.label}</h3>
              <span className="mt-4 inline-block text-sm font-semibold text-primary">Open permanent KTR record →</span>
            </a>
          ))}</div> : <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">No strong permanent match yet. Try a more specific term such as the agency, policy area, law, election, tax, utility, school, border, water, crime, transportation, or Legislature issue. You can also use the <a href="/texas-government/agencies" className="font-semibold underline">agency directory</a>.</p>}
        </section>
      ) : null}

      <aside className="mt-10 border-t pt-6 text-xs leading-6 text-muted-foreground"><strong className="text-foreground">Scope:</strong> This is a routing tool over KTR's published Government Graph. It does not determine legal jurisdiction for a specific lawsuit, replace an official agency decision, or infer authority that is not represented in KTR's maintained source layer.</aside>
    </main>
  );
}
