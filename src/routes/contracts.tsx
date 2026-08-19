import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CONTRACT_WATCH_REVIEWED_AT,
  CONTRACT_WATCH_RULES,
  CONTRACT_WATCH_TOOLS,
} from "@/data/texas-contract-watch";
import { buildSeo, SITE_URL } from "@/lib/seo";

const TITLE = "Texas Contract Watch | State Contracts, Vendors & Procurement";
const DESCRIPTION = "Search Texas state contracts, vendors, procurement notices, amendments, and vendor-performance records using official LBB, Comptroller, ESBD, and DIR sources.";

export const Route = createFileRoute("/contracts")({
  head: () => {
    const seo = buildSeo({ title: TITLE, description: DESCRIPTION, path: "/contracts" });
    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Texas Contract Watch",
            description: DESCRIPTION,
            url: `${SITE_URL}/contracts`,
            isPartOf: { "@type": "WebSite", name: "Keep TX Red", url: SITE_URL },
          }),
        },
      ],
    };
  },
  component: TexasContractWatchPage,
});

function TexasContractWatchPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <nav aria-label="Breadcrumb" className="mb-6 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        <Link to="/">Home</Link><span className="mx-2">/</span>Texas Contract Watch
      </nav>

      <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-primary">Government accountability</p>
      <h1 className="mt-3 max-w-4xl font-display text-4xl leading-[1.03] tracking-tight md:text-6xl">Texas Contract Watch</h1>
      <p className="mt-5 max-w-3xl font-serif text-lg italic leading-snug text-muted-foreground md:text-xl">
        Follow who Texas agencies contract with, what the state is buying, how much contracts are worth, when awards grow, and how vendors perform.
      </p>

      <section className="mt-8 border-l-4 border-primary bg-primary/5 p-6">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary">Quick answer</p>
        <p className="mt-3 text-base font-semibold leading-7">
          The Legislative Budget Board maintains the master searchable database for reported Texas state contracts. The Comptroller adds statewide procurement, bid-opportunity, and vendor-performance systems, while DIR covers statewide technology contracts. Contract Watch brings those official systems into one investigation path without pretending every state purchase lives in one database.
        </p>
      </section>

      <section className="mt-11">
        <h2 className="border-b pb-2 font-display text-3xl tracking-tight">Search official Texas contract records</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {CONTRACT_WATCH_TOOLS.map((tool) => (
            <a key={tool.url} href={tool.url} target="_blank" rel="noopener noreferrer" className="rounded-xl border bg-card p-5 hover:border-primary">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{tool.publisher}</p>
              <h3 className="mt-2 text-lg font-semibold text-primary">{tool.label} ↗</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{tool.purpose}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {tool.searchBy.map((item) => <span key={item} className="rounded-full border bg-background px-2.5 py-1 text-[11px] font-semibold">{item}</span>)}
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-xl border bg-muted/20 p-6">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary">Watch thresholds</p>
        <h2 className="mt-2 font-display text-3xl tracking-tight">Records worth flagging</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {CONTRACT_WATCH_RULES.map((rule) => (
            <a key={rule.label} href={rule.sourceUrl} target="_blank" rel="noopener noreferrer" className="rounded-lg border bg-background p-4 hover:border-primary">
              <p className="text-sm font-semibold">{rule.label}</p>
              <p className="mt-1 font-display text-2xl text-primary">{rule.threshold}</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{rule.detail}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-6">
          <h2 className="font-display text-2xl tracking-tight">How KTR will investigate a contract</h2>
          <ol className="mt-4 space-y-3 text-sm leading-6">
            <li><strong>1. Find the award.</strong> Identify the agency, vendor, amount, award date, term, and contract ID.</li>
            <li><strong>2. Open the documents.</strong> Review the solicitation, award, amendments, renewals, extensions, and agency-provided contract files.</li>
            <li><strong>3. Follow the vendor.</strong> Check vendor-performance reports, other state awards, and repeated agency relationships.</li>
            <li><strong>4. Compare growth.</strong> Flag large amendments, renewals, extensions, emergency awards, and material changes from the original value.</li>
            <li><strong>5. Connect the graph.</strong> Link the contract to the agency, relevant budget/program, lawmakers or oversight bodies, and KTR reporting.</li>
          </ol>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <h2 className="font-display text-2xl tracking-tight">What Contract Watch does not assume</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6">
            <li>• A large contract is not evidence of wrongdoing.</li>
            <li>• An awarded amount is not necessarily the amount ultimately paid.</li>
            <li>• A statewide contract is not proof that every eligible agency used it.</li>
            <li>• A contract amendment may change scope, term, price, or all three; the underlying documents control.</li>
            <li>• Missing data should be treated as missing, not filled with an inferred vendor, value, or purpose.</li>
          </ul>
        </div>
      </section>

      <section className="mt-12 rounded-xl border-2 border-primary/20 p-6">
        <h2 className="font-display text-2xl tracking-tight">Connected KTR authority</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link to="/data/state-budget-spending" className="rounded-lg border bg-background p-4 text-sm font-semibold hover:border-primary hover:text-primary">Texas budget & spending →</Link>
          <Link to="/texas-government/agencies" className="rounded-lg border bg-background p-4 text-sm font-semibold hover:border-primary hover:text-primary">Texas agencies →</Link>
          <Link to="/bills" className="rounded-lg border bg-background p-4 text-sm font-semibold hover:border-primary hover:text-primary">Texas bills →</Link>
          <Link to="/texas-legislature" className="rounded-lg border bg-background p-4 text-sm font-semibold hover:border-primary hover:text-primary">Texas Legislature →</Link>
        </div>
      </section>

      <aside className="mt-10 border-t pt-6 text-xs leading-6 text-muted-foreground">
        <strong className="text-foreground">Source standard:</strong> Contract Watch uses official state databases and agency-provided contract records as the controlling evidence. Reporting thresholds and systems can change; source registry reviewed {CONTRACT_WATCH_REVIEWED_AT}.
      </aside>
    </main>
  );
}
