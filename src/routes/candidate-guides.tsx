import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { ELECTION_RACES } from "@/data/articles";

export const Route = createFileRoute("/candidate-guides")({
  head: () => ({
    meta: [
      { title: "Texas Candidate Guides — Keep TX Red" },
      { name: "description", content: "Conservative candidate guides for Texas federal, state, and local races. Positions, endorsements, and voting records." },
      { property: "og:title", content: "Texas Candidate Guides" },
    ],
    links: [{ rel: "canonical", href: "/candidate-guides" }],
  }),
  component: CandidateGuidesPage,
});

const ISSUES = [
  "Border Security",
  "Property Tax Relief",
  "School Choice",
  "2A / Constitutional Carry",
  "Election Integrity",
  "Energy & Grid",
  "Parental Rights",
  "Life",
];

function CandidateGuidesPage() {
  return (
    <>
      <PageHero eyebrow="Voter Guide" title="CANDIDATE" highlight="GUIDES" description="Know where they stand before you cast your ballot. Conservative ratings across every major Texas race." />
      <div className="mx-auto max-w-6xl px-4 py-14 space-y-10">
        <section>
          <h2 className="font-display text-3xl tracking-tight border-b-2 border-foreground/20 pb-2 mb-6">Featured Races (2026)</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {ELECTION_RACES.map((r) => (
              <div key={r.office} className="border-2 border-foreground/10 bg-card p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">{r.status}</p>
                  <h3 className="font-display text-2xl tracking-tight mt-1">{r.office}</h3>
                  <p className="text-sm text-muted-foreground">{r.incumbent}</p>
                </div>
                <span className="font-display text-3xl text-primary">{r.margin}</span>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="font-display text-3xl tracking-tight border-b-2 border-foreground/20 pb-2 mb-6">Issues We Rate</h2>
          <div className="flex flex-wrap gap-2">
            {ISSUES.map((i) => (
              <span key={i} className="text-xs font-semibold uppercase tracking-widest px-3 py-2 bg-secondary text-secondary-foreground">{i}</span>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground max-w-2xl">Each candidate receives a grade A–F across the issues above based on their voting record, public statements, and questionnaire responses. Endorsements are issued only after our editorial board review.</p>
        </section>
      </div>
    </>
  );
}