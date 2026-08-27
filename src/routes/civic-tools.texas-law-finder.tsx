import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LAW_TOPICS } from "@/data/law-topics";
import { isLawTopicIndexable } from "@/lib/law-topic-indexability";
import { buildSeo } from "@/lib/seo";

const EXAMPLES = ["property tax protest", "can I carry a gun", "self defense", "public records request", "parents and school records", "eminent domain", "voter ID", "agency rules"];
const STOP = new Set(["texas", "what", "when", "where", "which", "with", "that", "this", "from", "have", "does", "about", "there", "their", "would", "could", "should"]);
const INDEXABLE_LAW_TOPICS = LAW_TOPICS.filter(isLawTopicIndexable);

function words(value: string) {
  return value.toLowerCase().split(/[^a-z0-9]+/g).filter((word) => word.length >= 3 && !STOP.has(word));
}

function scoreTopic(query: string, topic: (typeof LAW_TOPICS)[number]) {
  const haystack = `${topic.slug} ${topic.title} ${topic.dek} ${topic.quickAnswer} ${topic.appliesTo.join(" ")} ${topic.keyRules.join(" ")}`.toLowerCase();
  const queryWords = words(query);
  let score = 0;
  for (const word of queryWords) {
    if (haystack.includes(word)) score += word.length >= 7 ? 3 : 1;
  }
  if (query.trim().length >= 5 && haystack.includes(query.trim().toLowerCase())) score += 8;
  return score;
}

export const Route = createFileRoute("/civic-tools/texas-law-finder")({
  head: () => {
    const seo = buildSeo({
      title: "Texas Law Finder: Find the Statute Behind Your Question",
      description: "Describe a Texas legal or government question in plain English and find the most relevant KTR law guide, controlling code, primary sources, policy trackers, and related legislation.",
      path: "/civic-tools/texas-law-finder",
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: TexasLawFinder,
});

function TexasLawFinder() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    if (query.trim().length < 3) return [];
    return INDEXABLE_LAW_TOPICS.map((topic) => ({ topic, score: scoreTopic(query, topic) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score || a.topic.title.localeCompare(b.topic.title))
      .slice(0, 8);
  }, [query]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb"><Link to="/">Home</Link> / <Link to="/civic-tools">Civic Tools</Link> / Texas Law Finder</nav>
      <header className="mt-6 max-w-4xl">
        <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-primary">Texas Law Library tool</p>
        <h1 className="mt-3 font-display text-5xl tracking-tight sm:text-6xl">Texas Law Finder</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">Describe the issue in ordinary language. The tool searches KTR's maintained Texas law topics and sends you to the guide with the controlling statutes and official sources.</p>
      </header>

      <section className="mt-8 rounded-2xl border bg-card p-6 sm:p-8">
        <label htmlFor="law-query" className="text-sm font-bold">What are you trying to understand?</label>
        <div className="mt-3 flex gap-3">
          <input id="law-query" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Example: How do I protest my property appraisal?" className="min-w-0 flex-1 rounded-lg border bg-background px-4 py-3 text-base outline-none focus:border-primary" />
          {query ? <button type="button" onClick={() => setQuery("")} className="rounded-lg border px-4 py-3 text-sm font-semibold">Clear</button> : null}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">{EXAMPLES.map((example) => <button key={example} type="button" onClick={() => setQuery(example)} className="rounded-full border px-3 py-1.5 text-xs font-semibold hover:border-primary hover:text-primary">{example}</button>)}</div>
      </section>

      {query.trim().length >= 3 ? (
        <section className="mt-9">
          <h2 className="font-display text-3xl tracking-tight">Most relevant Texas law guides</h2>
          {results.length ? <div className="mt-5 space-y-4">{results.map(({ topic }, index) => (
            <a key={topic.slug} href={`/laws/topic/${topic.slug}`} className="block rounded-xl border bg-card p-5 hover:border-primary">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary">{index === 0 ? "Best match" : "Texas law topic"}</p>
              <h3 className="mt-2 font-display text-2xl tracking-tight">{topic.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{topic.quickAnswer}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-primary">See controlling statutes and sources →</span>
            </a>
          ))}</div> : <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">KTR does not yet have a strong maintained law-topic match. Browse the <a href="/laws/topics" className="font-semibold underline">Texas Law Library</a> or use the <a href="/civic-tools/government-authority-finder" className="font-semibold underline">Government Authority Finder</a> to identify the responsible institution.</p>}
        </section>
      ) : null}

      <aside className="mt-10 border-t pt-6 text-xs leading-6 text-muted-foreground"><strong className="text-foreground">Not legal advice:</strong> This tool routes readers to general legal information and primary statutes. It does not determine how the law applies to a specific person, case, deadline, criminal charge, property dispute, or pending proceeding.</aside>
    </main>
  );
}
