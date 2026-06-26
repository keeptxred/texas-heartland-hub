import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";

export const Route = createFileRoute("/get-involved")({
  head: () => ({
    meta: [
      { title: "Get Involved — Keep TX Red" },
      { name: "description", content: "Register to vote, contact your legislators, find your representative, and find your polling place." },
      { property: "og:title", content: "Get Involved — Keep TX Red" },
    ],
    links: [{ rel: "canonical", href: "/get-involved" }],
  }),
  component: GetInvolvedPage,
});

const ACTIONS = [
  { to: "/register-to-vote", title: "Register to Vote", desc: "Eligibility, deadlines, and how to file your application." },
  { to: "/find-representative", title: "Find Your Representative", desc: "Look up federal and state districts by address or ZIP." },
  { to: "/contact-legislators", title: "Contact Your Legislators", desc: "Phone scripts, email templates, and direct lines." },
  { to: "/voting-locations", title: "Voting Locations", desc: "Find your polling place and early voting sites." },
  { to: "/county-elections", title: "County Election Pages", desc: "Local election info for every major Texas county." },
] as const;

function GetInvolvedPage() {
  return (
    <>
      <PageHero eyebrow="Take Action" title="GET" highlight="INVOLVED" description="The Republican majority in Texas is built by engaged citizens, not consultants. Pick a job and get started today." />
      <div className="mx-auto max-w-6xl px-4 py-14 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {ACTIONS.map((a) => (
          <Link key={a.to} to={a.to} className="block border-2 border-foreground/10 bg-card p-6 hover:border-primary transition-colors">
            <h2 className="font-display text-2xl tracking-tight">{a.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{a.desc}</p>
            <span className="mt-4 inline-block text-xs font-bold uppercase tracking-widest text-primary">Go →</span>
          </Link>
        ))}
      </div>
    </>
  );
}