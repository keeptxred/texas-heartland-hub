import { Link, createFileRoute } from "@tanstack/react-router";

const SITE_URL = "https://keeptxred.com";
const PAGE_URL = `${SITE_URL}/tools`;

const POLICY_TOOLS = [
  {
    href: "/tools/texas-spending-growth-cap",
    title: "Texas Spending Growth Calculator",
    description: "Compare a proposed spending level with a population-plus-inflation benchmark without confusing that policy benchmark with Texas's legal spending limits.",
    guideHref: "/issues/texas-economy-no-income-tax",
    guideLabel: "Texas economy & taxes guide",
  },
  {
    href: "/tools/texas-tax-structure-comparison",
    title: "Texas Tax Structure Comparison",
    description: "Enter your own assumptions to compare how different state and local tax structures affect a household without hard-coding a claimed universal tax burden.",
    guideHref: "/issues/texas-economy-no-income-tax",
    guideLabel: "How Texas pays for government",
  },
  {
    href: "/tools/texas-rainy-day-fund",
    title: "Texas Rainy Day Fund Explorer",
    description: "Test a hypothetical Economic Stabilization Fund withdrawal against the latest official-source-backed projection in KTR's reviewed state-budget dataset.",
    guideHref: "/issues/texas-economy-no-income-tax",
    guideLabel: "Texas fiscal policy context",
  },
  {
    href: "/tools/texas-budget-headroom",
    title: "Texas Budget Headroom Calculator",
    description: "Stress-test certified General Revenue-related revenue and spending assumptions to see how much projected ending balance remains or whether a shortfall appears.",
    guideHref: "/issues/texas-economy-no-income-tax",
    guideLabel: "Texas budget & fiscal context",
  },
] as const;

export const Route = createFileRoute("/tools/")({
  head: () => ({
    meta: [
      { title: "Texas Policy Tools & Calculators | Keep TX Red" },
      { name: "description", content: "Use Keep TX Red's Texas fiscal-policy calculators and scenario tools, with source context and links to permanent issue guides." },
      { property: "og:title", content: "Texas Policy Tools & Calculators | Keep TX Red" },
      { property: "og:description", content: "Texas fiscal-policy calculators and scenario explorers connected to KTR's source-first issue guides." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: PAGE_URL },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Texas Policy Tools & Calculators",
        url: PAGE_URL,
        description: "Keep TX Red fiscal-policy calculators and scenario tools.",
        hasPart: POLICY_TOOLS.map((tool) => ({ "@type": "WebApplication", name: tool.title, url: `${SITE_URL}${tool.href}` })),
      }),
    }],
  }),
  component: PolicyToolsHub,
});

function PolicyToolsHub() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <nav className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-primary">Home</Link> <span aria-hidden="true">/</span> Policy Tools
      </nav>

      <header className="mt-5 max-w-4xl">
        <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">★ Texas Policy Tools</span>
        <h1 className="mt-2 font-display text-5xl leading-none tracking-tight md:text-7xl">CALCULATE THE<br /><span className="text-primary">POLICY TRADEOFFS</span></h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          KTR tools turn fiscal-policy claims into transparent arithmetic. Each calculator explains its assumptions, links to source material, and connects back to permanent issue guides so a number is never presented without policy context.
        </p>
      </header>

      <section className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4" aria-label="Texas policy calculators">
        {POLICY_TOOLS.map((tool) => (
          <article key={tool.href} className="flex flex-col border bg-muted/20 p-6">
            <h2 className="font-display text-3xl tracking-tight">{tool.title}</h2>
            <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{tool.description}</p>
            <div className="mt-6 space-y-3 border-t pt-4">
              <a href={String(tool.href)} className="block font-semibold text-primary hover:underline">Open tool →</a>
              <a href={String(tool.guideHref)} className="block text-sm font-semibold hover:text-primary">{tool.guideLabel} →</a>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-12 grid gap-6 border-t pt-8 md:grid-cols-3">
        <div>
          <h2 className="font-display text-3xl tracking-tight">How KTR builds tools</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Policy tools should make assumptions visible, distinguish arithmetic from legal conclusions, avoid invented precision, and use maintained official-source datasets when current government figures are required.
          </p>
        </div>
        <div>
          <h2 className="font-display text-3xl tracking-tight">Need the underlying policy?</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Start with the permanent Texas Issues library for statutes, agencies, enacted bills, primary sources and related explainers before treating any calculator output as a policy conclusion.
          </p>
          <Link to="/issues" className="mt-4 inline-block font-semibold text-primary hover:underline">Browse Texas issue guides →</Link>
        </div>
        <div>
          <h2 className="font-display text-3xl tracking-tight">Need a civic lookup instead?</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Texas Civic Tools route questions to government authority, relevant laws and bills, representatives, voting resources, and legislator comparisons without mixing those lookup tasks into fiscal calculators.
          </p>
          <Link to="/civic-tools" className="mt-4 inline-block font-semibold text-primary hover:underline">Browse Texas Civic Tools →</Link>
        </div>
      </section>
    </main>
  );
}