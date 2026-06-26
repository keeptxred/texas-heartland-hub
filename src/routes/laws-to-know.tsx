import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";

export const Route = createFileRoute("/laws-to-know")({
  head: () => ({
    meta: [
      { title: "Texas Laws You Should Know — Keep TX Red" },
      { name: "description", content: "Everyday Texas laws — carry permits, traffic stops, open carry, alcohol, knives, and more. What every Texan should know." },
      { property: "og:title", content: "Texas Laws You Should Know" },
    ],
    links: [{ rel: "canonical", href: "/laws-to-know" }],
  }),
  component: LawsToKnowPage,
});

const ITEMS = [
  { title: "Carrying a Handgun", body: "Texans 21+ may carry a handgun in a holster openly or concealed without a license. Federal gun-free zones, schools, polling places, and businesses with a 30.06/30.07 sign are off limits." },
  { title: "Traffic Stops", body: "You must provide your driver license, proof of insurance, and registration. You are not required to consent to a vehicle search. If you have a handgun in the vehicle and an LTC, disclose if asked." },
  { title: "Knives", body: "Location-restricted knives (blades over 5.5 inches) may not be carried into schools, polling places, courts, bars, sporting events, or correctional facilities." },
  { title: "Alcohol", body: "Last call is 2 a.m. with a late-hours permit, otherwise midnight (Sun 12 a.m.). Sunday beer/wine sales begin at 10 a.m.; liquor stores are closed Sundays." },
  { title: "Castle Doctrine", body: "Texas presumes reasonable force in your home, vehicle, or workplace against an unlawful intruder. No duty to retreat (Penal Code 9.31 to 9.32)." },
  { title: "Open Records", body: "The Texas Public Information Act gives you the right to request government records. Agencies must respond within 10 business days." },
  { title: "Recording Conversations", body: "Texas is a one-party-consent state. You may record any conversation you are a party to." },
  { title: "Right-to-Work", body: "No one can be required to join a union or pay dues as a condition of employment." },
  { title: "Homestead Protection", body: "Your primary residence is largely protected from creditors. Urban homesteads are protected up to 10 acres; rural up to 100/200 acres." },
  { title: "Voter ID", body: "Bring one of seven accepted photo IDs. Expired IDs are accepted up to 4 years (no limit if 70+)." },
];

function LawsToKnowPage() {
  return (
    <>
      <PageHero eyebrow="Everyday Texan" title="LAWS YOU" highlight="SHOULD KNOW" description="Practical, day-to-day Texas law — the kind that comes up at the gun range, on the highway, and at the ballot box." />
      <div className="mx-auto max-w-5xl px-4 py-14">
        <div className="grid md:grid-cols-2 gap-5">
          {ITEMS.map((it) => (
            <div key={it.title} className="border-2 border-foreground/10 bg-card p-6">
              <h2 className="font-display text-2xl tracking-tight">{it.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{it.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-xs text-muted-foreground italic">For deeper legal context on major statutes, see <Link to="/texas-laws" className="text-primary underline">Texas Laws Explained</Link>. This is not legal advice.</p>
      </div>
    </>
  );
}