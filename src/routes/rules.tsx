import { createFileRoute, Link } from "@tanstack/react-router";
import {
  RULE_WATCH_REVIEWED_AT,
  RULE_WATCH_SOURCES,
  RULE_WATCH_STAGES,
} from "@/data/texas-rule-watch";
import { buildSeo, SITE_URL } from "@/lib/seo";

const TITLE = "Texas Rule Watch | Agency Rules & Texas Register Tracker";
const DESCRIPTION = "Track proposed, adopted, emergency, withdrawn, and reviewed Texas agency rules through the Texas Register and Texas Administrative Code.";

export const Route = createFileRoute("/rules")({
  head: () => {
    const seo = buildSeo({ title: TITLE, description: DESCRIPTION, path: "/rules" });
    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Texas Rule Watch",
            description: DESCRIPTION,
            url: `${SITE_URL}/rules`,
            isPartOf: { "@type": "WebSite", name: "Keep TX Red", url: SITE_URL },
          }),
        },
      ],
    };
  },
  component: TexasRuleWatchPage,
});

function TexasRuleWatchPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <nav aria-label="Breadcrumb" className="mb-6 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        <Link to="/">Home</Link><span className="mx-2">/</span>Texas Rule Watch
      </nav>

      <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-primary">Government accountability</p>
      <h1 className="mt-3 max-w-4xl font-display text-4xl leading-[1.03] tracking-tight md:text-6xl">Texas Rule Watch</h1>
      <p className="mt-5 max-w-3xl font-serif text-lg italic leading-snug text-muted-foreground md:text-xl">
        Follow the agency rules that can change how Texas laws are implemented—before a proposed rule quietly becomes the rule Texans actually live under.
      </p>

      <section className="mt-8 border-l-4 border-primary bg-primary/5 p-6">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary">Quick answer</p>
        <p className="mt-3 text-base font-semibold leading-7">
          The Texas Register is the state&apos;s weekly journal of agency rulemaking. It publishes proposed, adopted, withdrawn, and emergency rule actions, agency rule reviews, and other official notices. Adopted agency rules are reflected in the Texas Administrative Code. Rule Watch gives KTR a permanent path from a news story to the proposal, agency authority, final rule, and current code.
        </p>
      </section>

      <section className="mt-11">
        <h2 className="border-b pb-2 font-display text-3xl tracking-tight">Official rulemaking sources</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {RULE_WATCH_SOURCES.map((source) => (
            <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer" className="rounded-xl border bg-card p-5 hover:border-primary">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{source.publisher}</p>
              <h3 className="mt-2 text-lg font-semibold text-primary">{source.label} ↗</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{source.purpose}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-xl border bg-muted/20 p-6">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary">Rule lifecycle</p>
        <h2 className="mt-2 font-display text-3xl tracking-tight">What KTR should watch</h2>
        <div className="mt-5 space-y-4">
          {RULE_WATCH_STAGES.map((stage) => (
            <div key={stage.stage} className="rounded-lg border bg-background p-5">
              <h3 className="text-lg font-semibold">{stage.stage}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{stage.meaning}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {stage.whatToCheck.map((item) => <span key={item} className="rounded-full border bg-muted/30 px-2.5 py-1 text-[11px] font-semibold">{item}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-6">
          <h2 className="font-display text-2xl tracking-tight">How a Rule Watch story should work</h2>
          <ol className="mt-4 space-y-3 text-sm leading-6">
            <li><strong>1. Identify the action.</strong> Proposed, adopted, emergency, withdrawn, or rule review.</li>
            <li><strong>2. Read the actual notice.</strong> Capture the agency, TAC citation, authority, dates, and agency explanation.</li>
            <li><strong>3. Compare text.</strong> Explain what changes instead of merely repeating the agency summary.</li>
            <li><strong>4. Find who is affected.</strong> Texans, businesses, licensees, schools, local governments, or other regulated parties.</li>
            <li><strong>5. Follow through.</strong> Update the story when comments close, the rule is adopted or withdrawn, or the TAC changes.</li>
          </ol>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <h2 className="font-display text-2xl tracking-tight">The accountability questions</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6">
            <li>• What statute gives the agency authority to do this?</li>
            <li>• Does the rule go beyond what lawmakers explicitly wrote?</li>
            <li>• What does the agency say it will cost government or regulated Texans?</li>
            <li>• Who submitted comments and what objections were accepted or rejected?</li>
            <li>• When does the change become enforceable?</li>
            <li>• Which lawmakers, committees, agencies, laws, and policy trackers should this connect to?</li>
          </ul>
        </div>
      </section>

      <section className="mt-12 rounded-xl border-2 border-primary/20 p-6">
        <h2 className="font-display text-2xl tracking-tight">Connected KTR authority</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link to="/texas-government/agencies" className="rounded-lg border bg-background p-4 text-sm font-semibold hover:border-primary hover:text-primary">Texas agencies →</Link>
          <Link to="/laws" className="rounded-lg border bg-background p-4 text-sm font-semibold hover:border-primary hover:text-primary">Texas laws →</Link>
          <Link to="/bills" className="rounded-lg border bg-background p-4 text-sm font-semibold hover:border-primary hover:text-primary">Texas bills →</Link>
          <Link to="/policy" className="rounded-lg border bg-background p-4 text-sm font-semibold hover:border-primary hover:text-primary">Policy trackers →</Link>
        </div>
      </section>

      <aside className="mt-10 border-t pt-6 text-xs leading-6 text-muted-foreground">
        <strong className="text-foreground">Source standard:</strong> The Texas Register notice, current Texas Administrative Code, and the promulgating agency are the controlling sources. The Secretary of State publishes the Register and TAC but does not interpret or enforce agency rules. Source registry reviewed {RULE_WATCH_REVIEWED_AT}.
      </aside>
    </main>
  );
}
