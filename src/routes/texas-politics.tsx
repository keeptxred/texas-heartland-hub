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
      { property: "og:url", content: "/texas-politics" },
    ],
    links: [{ rel: "canonical", href: "/texas-politics" }],
  }),
  component: TexasPoliticsPage,
});

function TexasPoliticsPage() {
  return (
    <>
      <HubView hub={HUB} sections={SECTIONS} />
      <AgedFeedSection
        section="politics"
        title="Latest from Austin"
        blurb="Governor's Office press releases and statewide political updates from the Happening Now feed, filed here once they're more than 24 hours old."
      />
    </>
  );
}