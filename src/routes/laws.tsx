import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";

export const Route = createFileRoute("/laws")({
  head: () => ({
    meta: [
      { title: "Texas Laws — Keep TX Red" },
      { name: "description", content: "Texas laws explained, the everyday laws every Texan should know, and live legislative updates from Austin." },
      { property: "og:title", content: "Texas Laws" },
    ],
    links: [{ rel: "canonical", href: "/laws" }],
  }),
  component: LawsHubPage,
});

const CARDS = [
  { to: "/texas-laws", title: "Texas Laws Explained", desc: "Plain-English breakdowns of major Texas statutes — carry, election integrity, property tax relief, parental rights." },
  { to: "/laws-to-know", title: "Laws You Should Know", desc: "Everyday law — traffic stops, alcohol, knives, recording, castle doctrine, homestead." },
  { to: "/legislative-updates", title: "Legislative Updates", desc: "Live tracking of bills moving through the Texas Legislature." },
] as const;

function LawsHubPage() {
  return (
    <>
      <PageHero eyebrow="Know Your Rights" title="TEXAS" highlight="LAWS" description="The statutes that govern the Lone Star State — explained, tracked, and translated for everyday Texans." />
      <div className="mx-auto max-w-6xl px-4 py-14 grid md:grid-cols-3 gap-5">
        {CARDS.map((c) => (
          <Link key={c.to} to={c.to} className="block border-2 border-foreground/10 bg-card p-6 hover:border-primary transition-colors">
            <h2 className="font-display text-2xl tracking-tight">{c.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
            <span className="mt-4 inline-block text-xs font-bold uppercase tracking-widest text-primary">Read →</span>
          </Link>
        ))}
      </div>
    </>
  );
}