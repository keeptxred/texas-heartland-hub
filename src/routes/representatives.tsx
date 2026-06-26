import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { US_SENATORS, STATE_LEADERSHIP, US_HOUSE_SAMPLE, type Rep } from "@/data/representatives";

export const Route = createFileRoute("/representatives")({
  head: () => ({
    meta: [
      { title: "Texas Representatives — Keep TX Red" },
      { name: "description", content: "Directory of Texas U.S. Senators, U.S. House members, the Governor, Lt. Governor, Attorney General, and statewide officials with phone numbers and websites." },
      { property: "og:title", content: "Texas Representatives" },
      { property: "og:description", content: "Contact your Texas elected officials — federal and state." },
    ],
    links: [{ rel: "canonical", href: "/representatives" }],
  }),
  component: RepresentativesPage,
});

function RepCard({ rep }: { rep: Rep }) {
  return (
    <div className="border-2 border-foreground/10 bg-card p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-2xl tracking-tight leading-tight">{rep.name}</h3>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
            {rep.office}{rep.district ? ` • ${rep.district}` : ""}
          </p>
        </div>
        <span className={`text-[10px] font-bold px-2 py-1 ${rep.party === "R" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>{rep.party}</span>
      </div>
      <dl className="mt-4 space-y-1 text-sm">
        {rep.phoneDC && <div><dt className="inline text-muted-foreground">DC:&nbsp;</dt><dd className="inline font-mono">{rep.phoneDC}</dd></div>}
        {rep.phoneTX && <div><dt className="inline text-muted-foreground">TX:&nbsp;</dt><dd className="inline font-mono">{rep.phoneTX}</dd></div>}
        <a href={rep.website} target="_blank" rel="noopener noreferrer" className="inline-block mt-1 text-primary font-semibold text-xs uppercase tracking-widest hover:underline">Visit Site →</a>
      </dl>
    </div>
  );
}

function Section({ title, reps }: { title: string; reps: Rep[] }) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-3xl tracking-tight border-b-2 border-foreground/20 pb-2 mb-6">{title}</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">{reps.map((r) => <RepCard key={r.name} rep={r} />)}</div>
    </section>
  );
}

function RepresentativesPage() {
  return (
    <>
      <PageHero
        eyebrow="Directory"
        title="TEXAS"
        highlight="REPRESENTATIVES"
        description="Every Texan deserves to know who speaks for them in Austin and Washington. Find your federal and state officials, then make the call."
      >
        <Link to="/find-representative" className="inline-block bg-primary text-primary-foreground px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-primary/90">Find My Rep by Address →</Link>
      </PageHero>
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <Section title="U.S. Senate" reps={US_SENATORS} />
        <Section title="Statewide Leadership" reps={STATE_LEADERSHIP} />
        <Section title="U.S. House (Texas Republican Delegation)" reps={US_HOUSE_SAMPLE} />
        <p className="mt-10 text-xs text-muted-foreground italic">Phone numbers compiled from official offices. For your specific House district, use the <Link to="/find-representative" className="text-primary underline">district lookup tool</Link>.</p>
      </div>
    </>
  );
}