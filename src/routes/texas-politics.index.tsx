import { createFileRoute, Link } from "@tanstack/react-router";
import { HUBS } from "@/data/hubs";
import { HubView } from "@/components/hub-view";
import { AgedFeedSection } from "@/components/aged-feed-section";
import { PillarRelationshipNav } from "@/components/pillar-relationship-nav";

const HUB = HUBS.find((h) => h.slug === "texas-politics")!;
const SECTIONS = [
  { title: "Elections", description: "Primaries, runoffs, and the races shaping the next Texas Legislature.", href: "/elections/2026" },
  { title: "Texas Election History", description: "How Texas moved from one-party primary dominance to two-party competition, Republican statewide control, modern turnout patterns and Election Central.", href: "/texas-politics/texas-election-history" },
  { title: "Texas Constitutional History", description: "The Republic and state constitutions from 1836 through the Constitution of 1876, the plural executive, amendment system and failed 1974 rewrite.", href: "/texas-politics/texas-constitutional-history" },
  { title: "Texas Voting Rights History", description: "Poll taxes, white primaries, women's suffrage, the Voting Rights Act, federal litigation and the changing legal framework for Texas voters.", href: "/texas-politics/voting-rights-history" },
  { title: "Texas Redistricting History", description: "Census-driven maps, one-person-one-vote, the Legislative Redistricting Board, Voting Rights Act litigation and the 2003 mid-decade redraw.", href: "/texas-politics/texas-redistricting-history" },
  { title: "Legislative Districts", description: "Permanent authority pages for all 150 Texas House districts and 31 Texas Senate districts, independent of the current officeholder.", href: "/districts" },
  { title: "Policy Trackers", description: "Permanent trackers for taxes, border security, education, energy, elections, crime, water, housing, healthcare, and the state budget.", href: "/policy" },
  { title: "Texas Law Library", description: "Plain-English guides to the statutes behind property taxes, gun rights, elections, parental rights, open records, property rights, and agency power.", href: "/laws" },
  { title: "Texas Data Center", description: "Official-source maps for taxes, state spending, election results, demographics, energy, water, and public-safety data.", href: "/data" },
  { title: "Political Reference", description: "Races, redistricting, voter trends, policy questions, PACs, and campaign activity — 50 source-backed search guides.", href: "/texas-political-reference" },
  { title: "Political Figures", description: "Evergreen, source-backed profiles connecting major Texas political careers to the state's Republican realignment and governing institutions.", href: "/texas-politics/figures" },
  { title: "Republicans During Reconstruction", description: "The 1867 origins of the Texas GOP, Black political leadership, the Davis administration, and the Black-and-Tan versus Lily-White struggle.", href: "/texas-politics/reconstruction-republicans" },
  { title: "Texas Supreme Court Realignment", description: "How statewide judicial elections, appointments and legal reform transformed Texas's highest civil court beginning in the late 1980s.", href: "/texas-politics/texas-supreme-court-realignment" },
  { title: "How Texas Became Republican", description: "A sourced timeline of Texas's shift from one-party Democratic rule to Republican statewide and legislative control.", href: "/texas-politics/how-texas-became-republican" },
  { title: "State Legislature", description: "Bills, special sessions, and the conservative caucus in Austin.", href: "/texas-legislature" },
  { title: "Governor & Leadership", description: "The Governor, Lt. Governor, AG, and statewide officeholders.", href: "/representatives" },
  { title: "Voting & Policy", description: "Voter ID, registration, election integrity, and ballot access.", href: "/elections/voting" },
];

const POLITICS_TOPICS = [
  { id: "elections", label: "Elections" },
  { id: "legislature", label: "State Legislature" },
  { id: "governor-leadership", label: "Governor & Leadership" },
  { id: "voting-policy", label: "Voting & Policy" },
];

export const Route = createFileRoute("/texas-politics/")({
  validateSearch: (search: Record<string, unknown>): { topic?: string } =>
    typeof search.topic === "string" && search.topic ? { topic: search.topic } : {},
  head: ({ match }) => {
    const topic = (match.search as { topic?: string } | undefined)?.topic ?? "";
    const canonical = "https://keeptxred.com/texas-politics";
    return {
      meta: [
        { title: "Texas Politics — Elections, Legislature & Government News" },
        { name: "description", content: "Coverage of Texas elections, political and constitutional history, redistricting, voting rights, legislative districts, government, policy trackers, Texas law guides, official data sources, and political developments." },
        { property: "og:title", content: "Texas Politics — Keep TX Red" },
        { property: "og:description", content: "Texas elections, political history, redistricting, voting rights, districts, government, legislative updates, policy trackers, law guides, official data, and political developments." },
        { property: "og:url", content: canonical },
        { property: "og:type", content: "website" },
        ...(topic ? [{ name: "robots", content: "noindex,follow" }] : []),
      ],
      links: [{ rel: "canonical", href: canonical }],
    };
  },
  component: TexasPoliticsPage,
});

function TexasPoliticsPage() {
  const { topic } = Route.useSearch();
  return (
    <>
      <HubView hub={HUB} sections={SECTIONS} filterTopic={topic}>
        <section className="mt-10">
          <h2 className="font-display text-2xl tracking-tight mb-3">Filter Coverage by Topic</h2>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/texas-politics"
              search={{ topic: "" }}
              className={`text-[11px] font-semibold uppercase tracking-widest px-3 py-1.5 border ${
                !topic ? "bg-foreground text-background border-foreground" : "border-border hover:border-primary hover:text-primary"
              }`}
            >
              All
            </Link>
            {POLITICS_TOPICS.map((t) => {
              const active = topic === t.id;
              return (
                <Link
                  key={t.id}
                  to="/texas-politics"
                  search={{ topic: active ? "" : t.id }}
                  className={`text-[11px] font-semibold uppercase tracking-widest px-3 py-1.5 border ${
                    active ? "bg-foreground text-background border-foreground" : "border-border hover:border-primary hover:text-primary"
                  }`}
                >
                  {t.label}
                </Link>
              );
            })}
          </div>
        </section>
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
              KTR's <a href="/texas-politics/texas-constitutional-history" className="font-semibold text-primary underline underline-offset-4">Texas Constitutional History</a> explains why that power is divided in the first place: the sequence from the Republic constitution through the 1845, 1861, 1866, 1869 and 1876 charters, the post-Reconstruction reaction against concentrated authority, the plural executive and the amendment system voters still use today.
            </p>
            <p>
              The <a href="/texas-politics/texas-election-history" className="font-semibold text-primary underline underline-offset-4">Texas Election History</a> guide supplies the electoral chronology beneath Election Central, from the era when the Democratic primary usually decided statewide office through presidential ticket-splitting, Republican breakthroughs, the 1998 statewide sweep and the 2002 Texas House takeover.
            </p>
            <p>
              Our <a href="/texas-politics/voting-rights-history" className="font-semibold text-primary underline underline-offset-4">Texas Voting Rights History</a> keeps the legal history distinct from present partisan disputes: poll taxes, white-primary litigation, women's suffrage, federal voting-rights law, language access and the post-2013 preclearance framework are sourced and explained as institutional changes.
            </p>
            <p>
              The <a href="/texas-politics/texas-redistricting-history" className="font-semibold text-primary underline underline-offset-4">Texas Redistricting History</a> guide connects census-driven population change to political geography, the Legislative Redistricting Board, federal voting-rights constraints, the 2003 mid-decade congressional redraw and the map cycles behind today's races.
            </p>
            <p>
              KTR's <a href="/districts" className="font-semibold text-primary underline underline-offset-4">Texas Legislative Districts</a> give every state House and Senate seat a permanent identity. Candidate pages can come and go with election cycles and representatives can change, but the district page remains stable and reconnects the seat to the new officeholder, bills, committees, campaign-finance records, election history, and official map sources.
            </p>
            <p>
              Our <a href="/policy" className="font-semibold text-primary underline underline-offset-4">Texas Policy Trackers</a> are the permanent layer beneath the news — taxes, border security, education, school choice, energy, water, housing, immigration, gun rights, elections, criminal justice, transportation, life policy, healthcare, and the state budget. Each tracker connects the issue to official sources, laws, legislation, KTR's editorial position, and related search guides.
            </p>
            <p>
              The <a href="/laws" className="font-semibold text-primary underline underline-offset-4">Texas Law Library</a> explains the controlling statutes, while the <a href="/data" className="font-semibold text-primary underline underline-offset-4">Texas Data Center</a> identifies the authoritative datasets, methodology, and limitations behind KTR's factual claims. Together they give daily stories a permanent legal and evidentiary backbone.
            </p>
            <p>
              Our <a href="/texas-political-reference" className="font-semibold text-primary underline underline-offset-4">Texas Political Reference</a> answers the high-intent questions behind the daily headlines — current races, map changes, voter trends, policy disputes, campaign finance, PACs, and public grassroots events — with dated status and source links.
            </p>
            <p>
              The <a href="/texas-politics/figures" className="font-semibold text-primary underline underline-offset-4">Texas Political Figures</a> library supplies the historical people layer: source-backed evergreen profiles of governors, senators, speakers, congressional leaders and other figures who shaped Texas's partisan realignment and governing institutions.
            </p>
            <p>
              The <a href="/texas-politics/reconstruction-republicans" className="font-semibold text-primary underline underline-offset-4">Texas Republicans During Reconstruction</a> guide reaches further back to the party's 1867 origins, the central role of Black voters and organizers, Edmund J. Davis's administration, and the later fight between Black-and-Tan and Lily-White Republicans. It keeps that nineteenth-century history distinct from the modern conservative coalition while showing the institutional continuity of the party organization.
            </p>
            <p>
              The <a href="/texas-politics/texas-supreme-court-realignment" className="font-semibold text-primary underline underline-offset-4">Texas Supreme Court Realignment</a> guide explains another part of that transition: how judicial elections and appointments, tort-law politics and statewide partisan change turned the state's highest civil court into a durable Republican institution beginning in the late 1980s. It also separates the politics of selecting judges from the legal reasoning used to decide individual cases.
            </p>
            <p>
              Our <a href="/texas-politics/how-texas-became-republican" className="font-semibold text-primary underline underline-offset-4">How Texas Became Republican</a> guide connects those individual careers to the larger chronology, from the 1952 Shivercrat split and John Tower's 1961 Senate victory through the 1998 statewide sweep and the Republican takeover of the Texas House after the 2002 election.
            </p>
          </div>
        </section>
        <PillarRelationshipNav pillarSlug="texas-politics-government" />
      </HubView>
      <AgedFeedSection
        section="politics"
        title="Latest from Austin"
        blurb="Governor's Office press releases and statewide political updates from the Happening Now feed, filed here once they're more than 24 hours old."
      />
    </>
  );
}
