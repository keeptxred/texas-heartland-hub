import { createFileRoute, Link } from "@tanstack/react-router";
import { ISSUE_CATEGORIES, getGuidesByCategory, issueGuides } from "@/data/issue-guides";

const SITE_URL = "https://keeptxred.com";
const PAGE_URL = `${SITE_URL}/issues`;

export const Route = createFileRoute("/issues/")({
  head: () => ({
    meta: [
      { title: "Texas Issues & Policy Guides | Keep TX Red" },
      { name: "description", content: "Source-first Keep TX Red guides to Texas energy, border security, taxes, education, constitutional rights, elections, healthcare and rural policy." },
      { property: "og:title", content: "Texas Issues & Policy Guides | Keep TX Red" },
      { property: "og:description", content: "Evergreen Texas policy explainers built around statutes, bills, agencies and primary sources." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: PAGE_URL },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Texas Issues & Policy Guides",
        url: PAGE_URL,
        description: "Evergreen, source-first guides to major Texas policy issues.",
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: issueGuides.length,
          itemListElement: issueGuides.map((guide, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: guide.title,
            url: `${SITE_URL}/issues/${guide.slug}`,
          })),
        },
      }),
    }],
  }),
  component: IssuesHub,
});

const AUTHORITY_LAYERS = [
  { href: "/policy", label: "Policy Trackers", eyebrow: "Current status", text: "Follow narrower policy questions as laws, agencies, litigation, implementation and official data change." },
  { href: "/tools", label: "Policy Tools", eyebrow: "Do the math", text: "Test fiscal-policy assumptions with transparent calculators and scenario explorers tied back to source context." },
  { href: "/civic-tools", label: "Civic Tools", eyebrow: "Find the source", text: "Locate Texas laws, bills, government authority and elected officials without relying on a summary alone." },
  { href: "/news", label: "Texas News", eyebrow: "Live coverage", text: "Move from permanent background into the latest bills, rulings, campaigns, agency actions and political fights." },
] as const;

function IssuesHub() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <header className="max-w-4xl">
        <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">★ Texas Policy</span>
        <h1 className="mt-2 font-display text-5xl leading-none tracking-tight md:text-7xl">TEXAS ISSUES<br /><span className="text-primary">EXPLAINED</span></h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">The permanent context behind the daily headlines. These guides separate statutes from slogans, identify which level of government controls what, link directly to bills and agencies, and connect breaking KTR coverage to the underlying Texas policy fight.</p>
      </header>

      <div className="mt-10 border-l-4 border-primary bg-muted/40 p-5">
        <p className="font-semibold">How these pages work</p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">Issue guides explain the durable framework. Policy trackers handle narrower questions that change more often. Tools expose the arithmetic. Civic tools help you reach the underlying law, bill or official. News coverage handles the live event. That division keeps KTR from creating multiple pages that compete to answer the same search.</p>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4" aria-label="Keep TX Red authority layers">
        {AUTHORITY_LAYERS.map((layer) => (
          <a key={layer.href} href={layer.href} className="group border bg-background p-5 transition hover:border-primary">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{layer.eyebrow}</span>
            <h2 className="mt-2 font-display text-2xl tracking-tight group-hover:text-primary">{layer.label}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{layer.text}</p>
            <span className="mt-4 inline-block text-sm font-semibold text-primary">Open →</span>
          </a>
        ))}
      </section>

      <div className="mt-12 space-y-14">
        {ISSUE_CATEGORIES.map((category) => {
          const guides = getGuidesByCategory(category);
          if (!guides.length) return null;
          return (
            <section key={category} aria-labelledby={category.replace(/\W+/g, "-").toLowerCase()}>
              <div className="flex items-end justify-between gap-4 border-b pb-3">
                <h2 id={category.replace(/\W+/g, "-").toLowerCase()} className="font-display text-3xl tracking-tight md:text-4xl">{category}</h2>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{guides.length} guides</span>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {guides.map((guide) => (
                  <a key={guide.slug} href={`/issues/${guide.slug}`} className="group border bg-background p-5 transition hover:border-primary">
                    <h3 className="font-display text-2xl leading-tight tracking-tight group-hover:text-primary">{guide.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{guide.dek}</p>
                    <span className="mt-4 inline-block text-sm font-semibold text-primary">Read the guide →</span>
                  </a>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <section className="mt-16 border-t pt-8">
        <h2 className="font-display text-3xl tracking-tight">Use the reporting, not just the label</h2>
        <p className="mt-3 max-w-4xl leading-relaxed text-muted-foreground">Keep TX Red has a conservative editorial perspective, but these reference pages are built to make claims checkable. Primary-source links are included so readers can inspect enacted bills, current statutes and agency material directly. Commentary belongs on top of a factual foundation, not in place of one.</p>
        <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold">
          <Link to="/policy" className="text-primary hover:underline">Browse policy trackers →</Link>
          <Link to="/tools" className="text-primary hover:underline">Use policy tools →</Link>
          <Link to="/texas-case" className="text-primary hover:underline">Read The Texas Case →</Link>
        </div>
      </section>
    </main>
  );
}
