import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { TEXAS_HOUSE_MEMBERS, TEXAS_SENATE_MEMBERS, representativeSlug, type Rep } from "@/data/representatives";
import { buildSeo } from "@/lib/seo";

const LEGISLATORS = [...TEXAS_SENATE_MEMBERS, ...TEXAS_HOUSE_MEMBERS].sort((a, b) => a.name.localeCompare(b.name));

export const Route = createFileRoute("/civic-tools/compare-legislators")({
  head: () => {
    const seo = buildSeo({
      title: "Compare Texas Legislators: Districts, Party & Profiles",
      description: "Compare two current Texas House or Senate members side by side, including chamber, district, party, official office links, and KTR authority profiles for legislation, committees, elections, and news.",
      path: "/civic-tools/compare-legislators",
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: CompareLegislators,
});

function CompareLegislators() {
  const [leftSlug, setLeftSlug] = useState("");
  const [rightSlug, setRightSlug] = useState("");
  const bySlug = useMemo(() => new Map(LEGISLATORS.map((rep) => [representativeSlug(rep.name), rep])), []);
  const left = leftSlug ? bySlug.get(leftSlug) : undefined;
  const right = rightSlug ? bySlug.get(rightSlug) : undefined;

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb"><Link to="/">Home</Link> / <Link to="/civic-tools">Civic Tools</Link> / Compare Legislators</nav>
      <header className="mt-6 max-w-4xl">
        <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-primary">Texas Legislature tool</p>
        <h1 className="mt-3 font-display text-5xl tracking-tight sm:text-6xl">Compare Texas Legislators</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">Put two current Texas House or Senate members side by side, then open their permanent KTR profiles for sponsored legislation, committees, election history, campaign-finance links, official sources, and related reporting.</p>
      </header>

      <section className="mt-8 grid gap-4 rounded-2xl border bg-card p-6 md:grid-cols-2 sm:p-8">
        <RepSelect label="First legislator" value={leftSlug} onChange={setLeftSlug} exclude={rightSlug} />
        <RepSelect label="Second legislator" value={rightSlug} onChange={setRightSlug} exclude={leftSlug} />
      </section>

      {(left || right) ? (
        <section className="mt-8 grid gap-5 md:grid-cols-2">
          <RepCard rep={left} placeholder="Choose the first legislator above." />
          <RepCard rep={right} placeholder="Choose the second legislator above." />
        </section>
      ) : null}

      <aside className="mt-10 border-t pt-6 text-xs leading-6 text-muted-foreground"><strong className="text-foreground">Comparison standard:</strong> This tool does not assign ideology scores or manufacture a voting record. It compares published identity and office data and sends readers to each maintained KTR authority profile for deeper evidence.</aside>
    </main>
  );
}

function RepSelect({ label, value, onChange, exclude }: { label: string; value: string; onChange: (value: string) => void; exclude: string }) {
  return <label className="text-sm font-bold">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-12 w-full rounded-lg border bg-background px-3 font-normal"><option value="">Select a Texas legislator</option>{LEGISLATORS.filter((rep) => representativeSlug(rep.name) !== exclude).map((rep) => <option key={`${rep.office}-${rep.district}-${rep.name}`} value={representativeSlug(rep.name)}>{rep.name} — {rep.district}</option>)}</select></label>;
}

function RepCard({ rep, placeholder }: { rep?: Rep; placeholder: string }) {
  if (!rep) return <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">{placeholder}</div>;
  const slug = representativeSlug(rep.name);
  return <article className="rounded-xl border bg-card p-6"><p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary">{rep.office}</p><h2 className="mt-2 font-display text-3xl tracking-tight">{rep.name}</h2><dl className="mt-5 space-y-3 text-sm"><Fact label="District" value={rep.district ?? "Statewide"} /><Fact label="Party" value={rep.party === "R" ? "Republican" : "Democratic"} /><Fact label="Texas office phone" value={rep.phoneTX ?? "See official office"} /></dl><div className="mt-6 flex flex-wrap gap-3"><a href={`/representatives/${slug}`} className="rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground">KTR authority profile</a><a href={rep.website} target="_blank" rel="noopener noreferrer" className="rounded-lg border px-4 py-2.5 text-sm font-bold">Official website ↗</a></div></article>;
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-4 border-b pb-2"><dt className="text-muted-foreground">{label}</dt><dd className="text-right font-semibold">{value}</dd></div>;
}
