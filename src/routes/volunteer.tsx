import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero, SectionCard } from "@/components/page-hero";

export const Route = createFileRoute("/volunteer")({
  head: () => ({
    meta: [
      { title: "Volunteer for Local Campaigns — Keep TX Red" },
      { name: "description", content: "Knock doors, work phone banks, and protect the polls. Sign up to volunteer for conservative campaigns across Texas." },
      { property: "og:title", content: "Volunteer for Local Campaigns" },
    ],
    links: [{ rel: "canonical", href: "/volunteer" }],
  }),
  component: VolunteerPage,
});

const ROLES = [
  { title: "Block Walking", desc: "Door-to-door canvassing in priority precincts. Saturdays in spring." },
  { title: "Phone Banking", desc: "Voter ID and GOTV calls from home or a county HQ." },
  { title: "Poll Watcher", desc: "Trained election observers. Requires county GOP appointment." },
  { title: "Sign Distribution", desc: "Yard signs, banners, intersection waves." },
  { title: "Election Day Driver", desc: "Get elderly and disabled voters to the polls." },
  { title: "Data Entry", desc: "VAN database upkeep and walk list cleaning." },
];

function VolunteerPage() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <PageHero eyebrow="Get Involved" title="VOLUNTEER" highlight="LOCAL CAMPAIGNS" description="Conservative wins are built precinct by precinct. School board, county commissioner, state house — every race needs feet on the ground." />
      <div className="mx-auto max-w-5xl px-4 py-14 space-y-10">
        <div>
          <h2 className="font-display text-3xl tracking-tight border-b-2 border-foreground/20 pb-2 mb-6">Where We Need You</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ROLES.map((r) => (
              <div key={r.title} className="border-2 border-foreground/10 bg-card p-5">
                <h3 className="font-display text-xl tracking-tight">{r.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <SectionCard title="Sign Up">
          {sent ? (
            <p className="text-primary font-semibold">Thanks — we'll connect you with your county GOP and matching campaigns this week.</p>
          ) : (
            <form className="grid md:grid-cols-2 gap-4" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <input required placeholder="Full name" className="h-11 px-3 border-2 border-foreground/20 bg-background" />
              <input required type="email" placeholder="Email" className="h-11 px-3 border-2 border-foreground/20 bg-background" />
              <input required placeholder="ZIP" className="h-11 px-3 border-2 border-foreground/20 bg-background" />
              <input placeholder="Phone (optional)" className="h-11 px-3 border-2 border-foreground/20 bg-background" />
              <select className="h-11 px-3 border-2 border-foreground/20 bg-background md:col-span-2">
                {ROLES.map((r) => <option key={r.title}>{r.title}</option>)}
              </select>
              <button className="md:col-span-2 h-11 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest hover:bg-primary/90">Count Me In →</button>
            </form>
          )}
        </SectionCard>
      </div>
    </>
  );
}