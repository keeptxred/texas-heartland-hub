import { createFileRoute } from "@tanstack/react-router";
import { HUBS } from "@/data/hubs";
import { HubView } from "@/components/hub-view";
import { AgedFeedSection } from "@/components/aged-feed-section";

const HUB = HUBS.find((h) => h.slug === "texas-politics")!;
const SECTIONS = [
  { title: "Elections", description: "Primaries, runoffs, and the races shaping the next Texas Legislature.", href: "/elections" },
  { title: "State Legislature", description: "Bills, special sessions, and the conservative caucus in Austin.", href: "/legislative-updates" },
  { title: "Governor & Leadership", description: "The Governor, Lt. Governor, AG, and statewide officeholders.", href: "/representatives" },
  { title: "Voting & Policy", description: "Voter ID, registration, election integrity, and ballot access.", href: "/register-to-vote" },
];

export const Route = createFileRoute("/texas-politics")({
  head: () => ({
    meta: [
      { title: "Texas Politics — Elections, Legislature & Government News" },
      { name: "description", content: "Coverage of Texas elections, government, legislative updates, and political developments from Austin to the precinct." },
      { property: "og:title", content: "Texas Politics — Keep TX Red" },
      { property: "og:description", content: "Coverage of Texas elections, government, legislative updates, and political developments." },
      { property: "og:url", content: "https://www.keeptxred.com/texas-politics" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://www.keeptxred.com/texas-politics" }],
  }),
  component: TexasPoliticsPage,
});

function TexasPoliticsPage() {
  return (
    <>
      <HubView hub={HUB} sections={SECTIONS}>
        <section className="mt-10 max-w-3xl">
          <h2 className="font-display text-2xl tracking-tight mb-3">The Map of Texas Politics</h2>
          <div className="space-y-4 font-serif text-base text-foreground/90 leading-relaxed">
            <p>
              Texas politics runs on a schedule most voters never see. The real decisions happen in
              March primaries, not November general elections — that's when the conservative caucus
              in Austin is actually chosen. By the time the general rolls around, most legislative
              seats have already been decided in a low-turnout primary or runoff.
            </p>
            <p>
              Statewide, power is split between the Governor, the Lieutenant Governor (who runs the
              Senate and controls what bills reach the floor), the Attorney General, and the Speaker
              of the House. Understanding what each office can and can't do explains why some
              Republican priorities pass in a single session while others stall for years.
            </p>
            <p>
              Below is our full stack: voting guides, primary vs. general breakdowns, a walkthrough
              of how a bill actually becomes Texas law, and the plain-English glossary of terms — from
              "quorum break" to "sine die" — that show up in every session recap.
            </p>
          </div>
        </section>
      </HubView>
      <AgedFeedSection
        section="politics"
        title="Latest from Austin"
        blurb="Governor's Office press releases and statewide political updates from the Happening Now feed, filed here once they're more than 24 hours old."
      />
    </>
  );
}