import { createFileRoute, Link } from "@tanstack/react-router";
import { buildSeo } from "@/lib/seo";

const TOOLS = [
  { title: "Who Controls This?", href: "/civic-tools/government-authority-finder", description: "Describe a Texas government issue and find the agency, policy tracker, law, data source, Legislature resource, or election authority most likely to control it." },
  { title: "Texas Law Finder", href: "/civic-tools/texas-law-finder", description: "Search KTR's permanent law library by a plain-English problem such as property taxes, self-defense, public records, school parental rights, or election rules." },
  { title: "Texas Bill Finder", href: "/civic-tools/bill-finder", description: "Start with a policy issue and hand it directly to KTR's Texas bill database, then narrow by Legislature, chamber, bill type, and status." },
  { title: "Compare Texas Legislators", href: "/civic-tools/compare-legislators", description: "Compare two current Texas House or Senate members side by side, then open their authority profiles for committees, bills, elections, and sources." },
  { title: "Education Freedom Account Guide", href: "/civic-tools/education-freedom-account-guide", description: "Check Texas TEFA basic eligibility factors, first-year priority tiers, and the published 2026–27 funding amount for private-school, disability, homeschool, or other eligible settings." },
  { title: "Find My Representative", href: "/find-representative", description: "Use official lookup resources to identify the Texas and federal officials connected to your address." },
  { title: "Contact Texas Legislators", href: "/contact-legislators", description: "Find official contact routes for Texas lawmakers and legislative offices." },
  { title: "Register to Vote", href: "/register-to-vote", description: "Review Texas voter-registration rules, deadlines, and official state resources." },
  { title: "Texas Bill Tracker", href: "/bills", description: "Search Texas legislation by bill, status, chamber, subject, sponsor, and legislative action." },
] as const;

export const Route = createFileRoute("/civic-tools")({
  head: () => {
    const seo = buildSeo({
      title: "Texas Civic Tools: Government, Law, Bills & Representatives",
      description: "Use Keep TX Red civic tools to identify Texas government authority, find relevant Texas laws and bills, compare legislators, research Texas Education Freedom Accounts, locate representatives, contact lawmakers, and research voting resources.",
      path: "/civic-tools",
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: CivicToolsHub,
});

function CivicToolsHub() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="max-w-4xl border-b pb-8">
        <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-primary">Permanent civic utility layer</p>
        <h1 className="mt-3 font-display text-5xl tracking-tight sm:text-6xl">Texas Civic Tools</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">Start with a real question, not a government org chart. These tools route Texans to the permanent KTR evidence layer—agencies, laws, bills, representatives, policy trackers, elections, and official sources.</p>
      </header>
      <section className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => <a key={tool.href} href={tool.href} className="group rounded-xl border bg-card p-6 hover:border-primary hover:shadow-md"><h2 className="font-display text-2xl tracking-tight group-hover:text-primary">{tool.title}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{tool.description}</p><span className="mt-5 inline-block text-sm font-semibold text-primary">Open tool →</span></a>)}
      </section>
      <section className="mt-10 grid gap-5 rounded-xl border bg-muted/20 p-6 md:grid-cols-2" aria-labelledby="civic-tool-authority-bridge">
        <div>
          <h2 id="civic-tool-authority-bridge" className="font-display text-2xl tracking-tight text-foreground">Need policy math instead of a civic lookup?</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">KTR's separate Policy Tools collection turns Texas budget, spending, and tax assumptions into transparent scenario calculations tied to permanent issue guides.</p>
          <Link to="/tools" className="mt-4 inline-flex font-semibold text-primary hover:underline">Browse Texas Policy Tools →</Link>
        </div>
        <div>
          <h2 className="font-display text-2xl tracking-tight text-foreground">Need the source-backed context?</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">Use the Texas Issues library when the question requires statutes, agencies, enacted bills, official datasets, or a maintained policy explainer rather than an interactive lookup.</p>
          <Link to="/issues" className="mt-4 inline-flex font-semibold text-primary hover:underline">Browse Texas issue guides →</Link>
        </div>
      </section>
      <section className="mt-10 rounded-xl border bg-muted/20 p-6 text-sm leading-7 text-muted-foreground"><strong className="text-foreground">How KTR tools work:</strong> they point to published KTR authority records and official sources; they do not create voter-specific legal advice, guess an address-specific ballot, invent missing government relationships, or assign unsupported ideology scores. For address-level representation, use the official lookup linked by <Link to="/find-representative" className="font-semibold text-primary underline">Find My Representative</Link>.</section>
    </main>
  );
}